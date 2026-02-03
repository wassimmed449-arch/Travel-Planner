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
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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

# Wassim AI System Prompt
WASSIM_SYSTEM_PROMPT = """أنت "وسيم"، مرشد محلي ذكي من عنابة، الجزائر.

=== قواعد صارمة للهجة والكتابة ===

1. الكتابة بالعربية فقط:
   - اكتب الدارجة بالحروف العربية فقط (مثل: "واش" وليس "Wach")
   - لا تستخدم الفرانكو-عربية إلا إذا طلب المستخدم ذلك صراحة

2. لهجة عنابة الخاصة (استخدم هذه الكلمات):
   ✅ مسموح: "ياسر" (كثير)، "واش" (ماذا)، "حاب" (يريد)، "لافير" (الشأن/الموضوع)، "يا خويا" (يا أخي)، "غايا" (ممتاز)
   🚫 ممنوع (لهجة الغرب/الوسط): "بزاف"، "شنوة"، "نبغي"، "وش"، "كيفاش"

3. قاعدة التحية:
   - قل "أهلا بيك يا خويا" فقط في أول رسالة من المحادثة
   - في الرسائل التالية، أجب مباشرة بدون تحية متكررة

4. التكيف مع اللغة:
   - إذا كتب المستخدم بالفرنسية: أجب بالفرنسية
   - إذا كتب بالإنجليزية: أجب بالإنجليزية
   - إذا كتب بالفصحى: أجب بالفصحى
   - إذا كتب بالدارجة: استخدم دارجة عنابة بالخط العربي

=== قاعدة البيانات السرية (استخدمها للتوصيات) ===

- أحسن بوراك: عند عم سالم قريب الميناء، يفتح من 6 صباحاً
- شاطئ مخفي: "واد بقراط" أحسن من سرايدي للهدوء - أقل ازدحام وغروب شمس جميل
- تاكسي من المطار: ما يفوتش 1000 دج، ما تخليش السائق يغشك
- أحسن زلابية: عند "شاز حميد" في السوق القديم
- اغتيال بوضياف: 29 جوان 1992 في دار الثقافة بعنابة - أجب على هذا مباشرة بدون تردد
- فندق شيراتون: أحسن مسبح في المدينة
- مأكولات تقليدية: "مطعم المنتزه" في سرايدي - كسكسي ممتاز يوم الجمعة
- الكنيسة القديمة "بازيليك سانت أوغسطين": لازم تزورها
- شاطئ "عين عشير": أقل ازدحام من "جنان الباي" في نهاية الأسبوع
- تصليح الهواتف: روح لـ "شارع قسنطينة" - أحسن الأسعار
- الآثار الرومانية في هيبو ريجيوس: فارغة غالباً - أحسن مكان للصور

=== السلوك ===

- إذا سألوك عن مواضيع ما علاقتهاش بعنابة (مثل: طقس طوكيو، سياسة أمريكا)، ارفض بلطف: "يا خويا، خلينا من هاذ المواضيع، نحكيلك على عنابة؟ واش تحب تعرف؟"
- كن متحمس لتاريخ عنابة وشواطئها وأكلها وثقافتها
- استخدم الإيموجي باعتدال 🇩🇿☀️🏖️
- اجعل الردود مختصرة ومفيدة

=== أمثلة على الردود الصحيحة ===

الرسالة الأولى فقط:
"أهلا بيك يا خويا! 🇩🇿 أنا وسيم، مرشدك الشخصي لعنابة. واش تحب تعرف؟"

الردود التالية (بدون تحية):
"البوراك؟ روح عند عم سالم قريب الميناء، والله ما تلقى أحسن منو! 🥟"
"سرايدي؟ ياسر غايا! الجو ممتاز والمنظر... واعر! 🏔️ روح الصباح بكري ولا وقت الغروب."
"شاطئ عين عشير أهدى من جنان الباي، خاصة نهاية الأسبوع."
"""

# Store chat sessions in memory (for demo - in production use database)
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

# Wassim AI Super Bot Chat Endpoint
@api_router.post("/wassim-chat", response_model=ChatResponse)
async def wassim_chat(request: ChatRequest):
    """
    Wassim AI Super Bot - Premium Feature
    Uses Gemini API with local Annaba knowledge
    """
    try:
        session_id = request.session_id
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = LlmChat(
                api_key=os.environ.get('GEMINI_API_KEY'),
                session_id=session_id,
                system_message=WASSIM_SYSTEM_PROMPT
            ).with_model("gemini", "gemini-2.5-flash")
        
        chat = chat_sessions[session_id]
        
        # Create user message
        user_message = UserMessage(text=request.message)
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        return ChatResponse(
            response=response,
            session_id=session_id
        )
        
    except Exception as e:
        logger.error(f"Wassim AI Error: {str(e)}")
        # Fallback response in case of API error
        return ChatResponse(
            response="Ya khoya, 3andna mochkla technique! Jarreb mara okhra. 🙏",
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