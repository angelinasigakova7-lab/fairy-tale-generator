from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import aiohttp
import asyncio
import base64
import random
from pydantic import BaseModel

# ============ СОЗДАЕМ ПРИЛОЖЕНИЕ (ВАЖНО: имя "app") ============
app = FastAPI()
# =============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ КЛЮЧИ ИЗ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ============
OPENROUTER_KEY = os.getenv("OPENROUTER_KEY", "")
HF_TOKEN = os.getenv("HF_TOKEN", "")
# =====================================================

class TopicRequest(BaseModel):
    topic: str

class GenerationResponse(BaseModel):
    tale: str
    image_base64: str = None
    image_url: str = None

# ============ API ЭНДПОИНТЫ ============
@app.get("/api/test")
async def test():
    return {
        "server": "✅ Render работает",
        "openrouter": "✅ есть" if OPENROUTER_KEY else "❌ нет",
        "huggingface": "✅ есть" if HF_TOKEN else "❌ нет"
    }

@app.post("/api/generate")
async def generate(request: TopicRequest):
    print(f"\n🎯 Генерируем сказку: {request.topic}")
    
    # 1. Генерируем текст через OpenRouter
    tale = await generate_text(request.topic)
    
    # 2. Генерируем картинку через Hugging Face
    image_base64 = await generate_image(request.topic)
    
    return GenerationResponse(
        tale=tale,
        image_base64=image_base64
    )

async def generate_text(topic):
    """Генерация текста через OpenRouter"""
    
    prompt = f"Напиши красивую волшебную сказку на тему '{topic}'. 10-15 предложений, добрая, с хорошим концом."
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "Ты детский писатель. Пишешь добрые волшебные сказки."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.8,
        "max_tokens": 800
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    return result["choices"][0]["message"]["content"]
                else:
                    return generate_fallback_tale(topic)
    except:
        return generate_fallback_tale(topic)

async def generate_image(topic):
    """Генерация картинки через Hugging Face"""
    
    prompt = f"Fairy tale illustration, {topic}, magical, fantasy art, bright colors"
    
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }
    
    models = [
        "black-forest-labs/FLUX.1-dev",
        "stabilityai/stable-diffusion-2-1"
    ]
    
    for model in models:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"https://api-inference.huggingface.co/models/{model}",
                    headers=headers,
                    json={"inputs": prompt},
                    timeout=60
                ) as response:
                    if response.status == 200:
                        image_bytes = await response.read()
                        return base64.b64encode(image_bytes).decode('utf-8')
        except:
            continue
    
    return None

def generate_fallback_tale(topic):
    """Запасная сказка"""
    tales = [
        f"В некотором царстве жил-был {topic}. Был он добрый и волшебный. Каждое утро он просыпался и творил чудеса. Однажды он встретил фею, и они подружились. С тех пор они вместе помогают всем в королевстве.",
        
        f"Жил на свете {topic}, который любил приключения. Однажды он отправился в волшебный лес и встретил там говорящего кота. Кот рассказал ему о злом колдуне, который заколдовал детей. {topic.title()} победил колдуна добротой и смелостью."
    ]
    return random.choice(tales)

# ============ ФРОНТЕНД ============
@app.get("/")
async def serve_frontend():
    return FileResponse("frontend/index.html")

@app.get("/{path:path}")
async def serve_static(path: str):
    file_path = f"frontend/{path}"
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse("frontend/index.html")

# ============ ЗАПУСК (для локального теста) ============
if __name__ == "__main__":
    import uvicorn
    print("="*60)
    print("🔥 ГЕНЕРАТОР НА RENDER")
    print("="*60)
    print("✅ Сервер готов к запуску")
    print("🌐 http://localhost:8000")
    print("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
