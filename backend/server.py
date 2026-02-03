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
import google.generativeai as genai


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure Google Generative AI with search grounding
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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

class ChatResponse(BaseModel):
    response: str
    session_id: str

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

# Store chat sessions - each session has its own chat history
chat_sessions = {}
# Track which sessions have received the initial greeting
greeted_sessions = set()

# Create the Gemini model with Google Search enabled
def get_gemini_model():
    """Create Gemini model with Google Search grounding enabled"""
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=WASSIM_SYSTEM_PROMPT,
        tools="google_search_retrieval"
    )

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

# Wassim AI Super Bot Chat Endpoint
@api_router.post("/wassim-chat", response_model=ChatResponse)
async def wassim_chat(request: ChatRequest):
    """
    Wassim AI Super Bot - Premium Feature
    Uses Gemini API with Google Search grounding for real-time info
    """
    try:
        session_id = request.session_id
        is_first_message = session_id not in greeted_sessions
        
        # Get or create chat session with Google Search enabled
        if session_id not in chat_sessions:
            model = get_gemini_model()
            chat_sessions[session_id] = model.start_chat(history=[])
        
        chat = chat_sessions[session_id]
        
        # Modify user message to include context about greeting
        message_text = request.message
        if not is_first_message:
            # Add instruction to not repeat greeting
            message_text = f"[هذه ليست أول رسالة - لا تكرر التحية، أجب مباشرة] {request.message}"
        else:
            greeted_sessions.add(session_id)
        
        # Send message and get response
        response = chat.send_message(message_text)
        
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
    client.close()