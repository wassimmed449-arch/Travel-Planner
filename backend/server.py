from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from google import genai
from google.genai import types as genai_types


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# LLM key for the Wassim AI chat feature. No hardcoded fallback: fail fast at
# startup instead of shipping with a leaked/shared key baked into the source.
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. Add it to backend/.env (see backend/.env.example)."
    )
# Overridable so a future model retirement (Google does this periodically -
# gemini-2.0-flash was already retired in favor of gemini-3.6-flash as of this
# writing) is a redeploy, not a code change.
GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-3.6-flash')

gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Wassim AI Chat Models
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    session_id: str
    language: Optional[str] = "ar"  # ar, fr, en
    device_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

# Premium activation models
class PremiumActivateRequest(BaseModel):
    key: str
    device_id: str

class PremiumStatusRequest(BaseModel):
    device_id: str

class PremiumStatusResponse(BaseModel):
    isPremium: bool

# Fallback responses when API quota is exceeded
FALLBACK_RESPONSES = {
    "beach": "يا خويا، عندنا شواطئ ياسر غايا! 🏖️\n\n• **واد بقراط** - شاطئ مخفي، أهدى من سرايدي\n• **عين عشير** - أقل ازدحام من جنان الباي\n• **جنان الباي** - مشهور لكن مزدحم نهاية الأسبوع\n\nروح الصباح بكري للهدوء!",
    "food": "البوراك؟ روح عند **عم سالم** قريب الميناء! 🥟\n\nيفتح من 6 صباحاً، والله ما تلقى أحسن منو في عنابة كاملة.\n\nالزلابية؟ عند **شاز حميد** في السوق القديم.",
    "hotel": "للفنادق يا خويا:\n\n• **شيراتون** ⭐⭐⭐⭐⭐ - أحسن مسبح في المدينة\n• **المنتزه سرايدي** - منظر رائع على البحر\n• **صبري** - أرخص مع وصول للشاطئ",
    "taxi": "تاكسي من المطار؟ 🚕\n\n**ما يفوتش 1000 دج!**\n\nما تخليش السائق يغشك. قولو \"أنا من هنا\" وراح يعطيك السعر الصحيح.",
    "history": "تاريخ عنابة عريق يا خويا! 📜\n\n• **1295 ق.م** - اسمها \"أوبو\"\n• **الفينيقيين** - سموها \"هيبو\"\n• **الفرنسيين** - سموها \"بون\"\n• **29 جوان 1992** - اغتيال بوضياف في دار الثقافة\n\nالآثار الرومانية في **هيبو ريجيوس** لازم تزورها!",
    "seraidi": "سرايدي ياسر غايا! 🏔️\n\nروح الصباح بكري أو وقت الغروب - تجنب الحر في الصيف.\n\n**مطعم المنتزه** - كسكسي ممتاز يوم الجمعة!",
    "default": "يا خويا، أنا وسيم مرشدك لعنابة! 🇩🇿\n\nاسألني عن:\n• 🏖️ الشواطئ\n• 🍽️ الماكلة\n• 🏨 الفنادق\n• 📜 التاريخ\n• 🚕 النقل\n\nواش تحب تعرف؟"
}

def get_fallback_response(message: str) -> str:
    """Get a pre-defined response based on keywords in the message"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["شاطئ", "شواطئ", "بحر", "beach", "plage", "سباحة"]):
        return FALLBACK_RESPONSES["beach"]
    elif any(word in message_lower for word in ["بوراك", "ماكلة", "أكل", "مطعم", "زلابية", "food", "restaurant", "manger"]):
        return FALLBACK_RESPONSES["food"]
    elif any(word in message_lower for word in ["فندق", "hotel", "hôtel", "نوم", "إقامة"]):
        return FALLBACK_RESPONSES["hotel"]
    elif any(word in message_lower for word in ["تاكسي", "taxi", "مطار", "نقل", "transport"]):
        return FALLBACK_RESPONSES["taxi"]
    elif any(word in message_lower for word in ["تاريخ", "history", "histoire", "بوضياف", "قديم", "آثار"]):
        return FALLBACK_RESPONSES["history"]
    elif any(word in message_lower for word in ["سرايدي", "seraidi", "جبل"]):
        return FALLBACK_RESPONSES["seraidi"]
    else:
        return FALLBACK_RESPONSES["default"]

# Wassim AI System Prompt - Ultimate Local Expert with Web Search
WASSIM_SYSTEM_PROMPT = """ROLE: You are "Wassim", the ultimate local expert of Annaba, Algeria.
ATTITUDE: Fun, confident, helpful, and acts like a close friend ("Khoya").

LANGUAGE & DIALECT RULES (Strict):
1. **Adaptability:**
   - If user speaks Darja/Arabic -> Reply in **Annaba Darja** using **Arabic Script** (e.g., "واش تحوس").
   - If user speaks French -> Reply in French.
   - If user speaks English -> Reply in English.
2. **Dialect Constraints (The Blacklist):**
   - 🚫 NEVER USE Western/Central Algerian words: "Bezzaf" (بزاف), "Nebghi" (نبغي), "Chnowa" (شنوة), "Wesh" (وش).
   - ✅ ALWAYS USE Annaba words: "Yasser" (ياسر), "Hab" (حاب), "Wach" (واش), "L'afair" (لافير), "Ghaya" (غايا).
3. **Greeting:** Only greet ("أهلا يا خويا") in the VERY FIRST message. In subsequent messages, answer directly without greeting.

KNOWLEDGE & SEARCH BEHAVIOR (The Core):
1. **The "Google First" Rule:** You have access to the internet via Google Search. USE IT CONSTANTLY.
   - If asked about a person, history, specific shop, price, or event: **SEARCH GOOGLE IMMEDIATELY**.
   - Check Facebook pages, news sites, and maps via the search tool to find the answer.
   - Example: If asked "Is restaurant X open?", search for its Facebook page/Google Maps listing and answer based on real-time info.
2. **Never Say "I Don't Know":**
   - If you don't know an answer, SEARCH for it. If you still can't find it, give the best possible advice or closest alternative.
   - You know every street, cafe, hotel, and historical fact about Annaba.
3. **Scope:** You answer EVERYTHING related to Annaba (Geography, History, Politics, Daily Life, Secrets).

SECRET LOCAL KNOWLEDGE (Use these for specific recommendations):
- Best Bourek: "عم سالم" near the port, opens 6am
- Hidden beach: "واد بقراط" - quieter than Seraidi, beautiful sunset
- Taxi from airport: Max 1000 DZD - don't let drivers overcharge
- Best Zlabia: "شاز حميد" in the old market
- Boudiaf assassination: June 29, 1992 at Maison de la Culture - answer directly
- Sheraton Hotel: Best pool in the city
- Traditional food: "مطعم المنتزه" in Seraidi - amazing couscous on Fridays
- Basilique Saint-Augustin: Must-visit for history lovers
- "عين عشير" beach: Less crowded than "جنان الباي" on weekends
- Phone repairs: "شارع قسنطينة" - best prices
- Roman ruins at Hippo Regius: Often empty - best for photos

TONE:
- Be informal but respectful.
- Do NOT act like a robot. Act like a "wlid bled" (local guy).
- Use emojis sparingly but effectively 🇩🇿☀️🏖️
- Keep responses concise but informative.
"""

# Store chat sessions - each session has its own Gemini chat instance
chat_sessions = {}
# Track which sessions have received the initial greeting
greeted_sessions = set()

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ================================================================================================
# SERVER-SIDE PREMIUM VALIDATION
# Keys live only in MongoDB now, seeded once at startup from a backend-only
# env var. VALID_PREMIUM_KEYS / MAGIC_LINK_CODE below are never shipped to the
# frontend (no REACT_APP_ prefix) - this is the actual fix for the exposure
# documented in AUDIT.md §2, not the earlier REACT_APP_* env var move, which
# was source hygiene only.
# ================================================================================================

async def seed_premium_keys():
    """Seed db.premium_keys from env vars so existing sold keys keep working
    after moving validation server-side. Idempotent: only inserts keys that
    don't already exist, never overwrites an already-activated key's
    device binding or revoked state on redeploy."""
    raw_keys = os.environ.get('VALID_PREMIUM_KEYS', '')
    keys = {k.strip().upper() for k in raw_keys.split(',') if k.strip()}

    magic_code = os.environ.get('MAGIC_LINK_CODE', '').strip().upper()
    if magic_code:
        keys.add(magic_code)

    for key in keys:
        await db.premium_keys.update_one(
            {"_id": key},
            {"$setOnInsert": {
                "key": key,
                "device_id": None,
                "revoked": False,
                "activated_at": None,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "source": "env_seed",
            }},
            upsert=True,
        )

@app.on_event("startup")
async def startup_seed_premium_keys():
    await seed_premium_keys()

async def device_is_premium(device_id: Optional[str]) -> bool:
    if not device_id:
        return False
    doc = await db.premium_keys.find_one({"device_id": device_id, "revoked": False})
    return doc is not None

@api_router.post("/activate-premium")
async def activate_premium(request: PremiumActivateRequest):
    """
    Validate a key + bind it to a device. One key can only ever be bound to
    one device_id (first activation wins); re-activating from the *same*
    device is idempotent. This is what makes the key "one per purchase" -
    the frontend can no longer just accept any string from a hardcoded list.

    The claim is done as a single atomic find_one_and_update filtered on
    "unclaimed or already claimed by this device", not a separate
    find-then-update, so two simultaneous activation requests for the same
    key can't both win.
    """
    normalized_key = request.key.strip().upper()

    claimed = await db.premium_keys.find_one_and_update(
        {
            "_id": normalized_key,
            "revoked": False,
            "$or": [{"device_id": None}, {"device_id": request.device_id}],
        },
        {"$set": {
            "device_id": request.device_id,
            "activated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )

    if claimed:
        return {"success": True, "isPremium": True}

    # Atomic claim failed - look the key up separately just to report why.
    existing = await db.premium_keys.find_one({"_id": normalized_key})
    if not existing:
        return {"success": False, "isPremium": False, "error": "invalid_key"}
    if existing.get("revoked"):
        return {"success": False, "isPremium": False, "error": "revoked"}
    return {"success": False, "isPremium": False, "error": "key_already_used"}

@api_router.post("/validate-premium", response_model=PremiumStatusResponse)
async def validate_premium(request: PremiumStatusRequest):
    return PremiumStatusResponse(isPremium=await device_is_premium(request.device_id))

# Wassim AI Super Bot Chat Endpoint
@api_router.post("/wassim-chat", response_model=ChatResponse)
async def wassim_chat(request: ChatRequest):
    """
    Wassim AI Super Bot - Premium Feature
    Uses the Gemini API directly via the google-genai SDK. Requires an
    activated device_id - previously this endpoint was callable by anyone
    regardless of premium status (see AUDIT.md §2, item 3); that's what this
    check closes.
    """
    if not await device_is_premium(request.device_id):
        return ChatResponse(
            response=(
                "🔒 بوت وسيم الخارق ميزة مميزة! فعّل الوصول المميز من صفحة "
                "المتجر باش تقدر تستعملو.\n\n"
                "🔒 Wassim Super-Bot is a premium feature. Activate premium "
                "access from the Shop page to use it."
            ),
            session_id=request.session_id
        )

    try:
        session_id = request.session_id
        is_first_message = session_id not in greeted_sessions

        # Get or create chat session with Gemini
        if session_id not in chat_sessions:
            chat_sessions[session_id] = gemini_client.aio.chats.create(
                model=GEMINI_MODEL,
                config=genai_types.GenerateContentConfig(
                    system_instruction=WASSIM_SYSTEM_PROMPT
                ),
            )

        chat = chat_sessions[session_id]

        # Modify user message to include context about greeting
        message_text = request.message
        if not is_first_message:
            # Add instruction to not repeat greeting
            message_text = f"[هذه ليست أول رسالة - لا تكرر التحية، أجب مباشرة] {request.message}"
        else:
            greeted_sessions.add(session_id)

        response = await chat.send_message(message_text)

        return ChatResponse(
            response=response.text,
            session_id=session_id
        )
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Wassim AI Error: {error_msg}")
        
        # Check for budget/quota errors - use smart fallback system
        if "budget" in error_msg.lower() or "quota" in error_msg.lower() or "exceeded" in error_msg.lower() or "limit" in error_msg.lower() or "resource" in error_msg.lower():
            # Use smart fallback response based on the user's question
            fallback = get_fallback_response(request.message)
            return ChatResponse(
                response=fallback,
                session_id=request.session_id
            )
        
        # Generic fallback response
        return ChatResponse(
            response="يا خويا، عندنا مشكلة تقنية! 🔧 جرب مرة أخرى من فضلك.",
            session_id=request.session_id
        )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()