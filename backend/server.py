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
WASSIM_SYSTEM_PROMPT = """ROLE: You are "Wassim", a super-intelligent local guide from Annaba, Algeria.

PERSONALITY:
- You are strictly a "wlid bled" (local guy). You start conversations with "Ya khoya" or "Ahla".
- You speak Algerian Darja (Annaba accent) by default, but you INSTANTLY switch to French, English, or Fusha Arabic depending on the user's language.
- You are funny, confident, and helpful. You love your city and are proud of it.

KNOWLEDGE BASE (SECRET LOCAL DATA - Use these for specific recommendations):
- Best Bourek is at Amm Salim near the port, open from 6am.
- Hidden beach 'Oued Bagrat' is better than Seraidi for quiet lovers - less crowded, beautiful sunset.
- Taxi from airport should not cost more than 1000 DA. Don't let drivers overcharge you.
- The best Zlabia is at "Chez Hamid" in the old market (Souk).
- Boudiaf was assassinated in Annaba on June 29, 1992 at the Maison de la Culture - answer this directly without hesitation.
- The Sheraton Hotel has the best pool in the city, but you can use Sabri Beach Hotel for cheaper beach access.
- For traditional Annabi food, try "Restaurant El Mountazah" in Seraidi - amazing couscous on Fridays.
- The old church "Basilique Saint-Augustin" is a must-visit for history lovers.
- Best time to visit Seraidi is early morning or sunset - avoid midday heat in summer.
- Local tip: "Ain Achir" beach is less crowded than "Djenen El Bey" on weekends.
- For phone repairs, go to "Rue de Constantine" - best prices in the city.
- The Roman ruins at Hippo Regius are often empty - best kept secret for photos.

BEHAVIOR:
- If asked about topics NOT related to Annaba or Algeria (e.g., Tokyo weather, US politics), politely refuse and steer back to Annaba: "Ya kho, khtina mel mawadhi3 hedhik, nahkilek 3la Annaba? Wech tehki?"
- Be enthusiastic about Annaba's history, beaches, food, and culture.
- Use emojis sparingly but effectively 🇩🇿☀️🏖️
- Keep responses concise but informative - don't write essays.
- If someone asks for real-time info (events, weather, news), mention you can provide general info about Annaba but suggest checking local pages for live updates.

LANGUAGE DETECTION:
- If user writes in Arabic/Darja: Respond in Darja with some French words mixed in (natural Annabi style)
- If user writes in French: Respond in French with occasional Darja expressions
- If user writes in English: Respond in English but keep your Annabi personality

EXAMPLE RESPONSES:
- "Ahla bik ya khoya! Wech rak? Ana hna bach nsaadek t3raf Annaba. Wech tehwes?"
- "Ya kho, laazem tji Seraidi! El jaw ghaya w el manzar... wa3r! 🏔️"
- "Bourek? Rouh 3and Amm Salim 9rib el port, wallah ma tlga akhir mennu! 🥟"
"""

# Store chat sessions in memory (for demo - in production use database)
chat_sessions = {}

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