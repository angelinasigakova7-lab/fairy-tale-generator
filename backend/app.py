import os
import aiohttp
import asyncio
import base64
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ============ СОЗДАЕМ ПРИЛОЖЕНИЕ ============
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicRequest(BaseModel):
    topic: str

class GenerationResponse(BaseModel):
    tale: str
    image_base64: str = None
    image_url: str = None

# ============ КЛЮЧИ ============
OPENROUTER_KEY = "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"
HF_TOKEN = "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"
# ====================================

# ============ ЭНДПОИНТЫ ============
@app.get("/")
async def root():
    return {
        "message": "✅ Генератор сказок",
        "status": "работает"
    }

@app.get("/test")
async def test():
    """Проверка ключей"""
    return {
        "server": "✅ работает",
        "openrouter_key": "✅ есть" if OPENROUTER_KEY else "❌ нет",
        "hf_token": "✅ есть" if HF_TOKEN else "❌ нет"
    }

@app.post("/generate", response_model=GenerationResponse)
async def generate(request: TopicRequest):
    print(f"\n🎯 Генерируем сказку: {request.topic}")
    
    try:
        # 1. Генерируем текст
        tale = await generate_text(request.topic)
        print(f"✅ Текст готов: {len(tale)} символов")
        
        # 2. Генерируем картинку
        image_base64 = await generate_image(request.topic, tale)
        
        if image_base64:
            return GenerationResponse(
                tale=tale,
                image_base64=image_base64
            )
        else:
            return GenerationResponse(
                tale=tale,
                image_url="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800"
            )
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return GenerationResponse(
            tale=generate_fallback_tale(request.topic),
            image_url="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800"
        )

# ============ ТВОИ ФУНКЦИИ (которые ты прислал) ============
async def generate_text(topic):
    """Генерация длинной сказки"""
    
    prompt = f"""Напиши подробную волшебную сказку на тему '{topic}'.

ТРЕБОВАНИЯ:
- Длина: 10-15 предложений
- Начало: "Жил-был..." или "В некотором царстве..."
- Середина: приключения, волшебство, встречи с персонажами
- Конец: счастливый финал, мораль
- Язык: красивый, литературный, с описаниями

Сказка:"""
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Fairy Tale Generator"
    }
    
    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "Ты известный детский писатель. Пишешь длинные, подробные, волшебные сказки с яркими описаниями."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.9,
        "max_tokens": 1000
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=60
        ) as response:
            if response.status == 200:
                result = await response.json()
                tale = result["choices"][0]["message"]["content"]
                return tale.strip()
            else:
                return generate_fallback_tale(topic)

async def generate_image(topic, tale):
    """Генерация картинки точно по теме"""
    
    tale_preview = tale[:150].replace('\n', ' ')
    
    prompt = f"Fairy tale illustration, {topic}, {tale_preview}, detailed fantasy art, magical atmosphere, vibrant colors, cinematic lighting, highly detailed, digital painting, artstation style"
    
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }
    
    models = [
        "black-forest-labs/FLUX.1-dev",
        "stabilityai/stable-diffusion-xl-base-1.0",
        "runwayml/stable-diffusion-v1-5"
    ]
    
    for model in models:
        try:
            print(f"🎨 Пробую модель: {model}")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"https://api-inference.huggingface.co/models/{model}",
                    headers=headers,
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "negative_prompt": "ugly, blurry, low quality, modern, realistic, photo",
                            "num_inference_steps": 30,
                            "guidance_scale": 7.5
                        }
                    },
                    timeout=60
                ) as response:
                    
                    if response.status == 200:
                        image_bytes = await response.read()
                        print(f"✅ Картинка готова!")
                        return base64.b64encode(image_bytes).decode('utf-8')
                    elif response.status == 503:
                        print(f"⏳ Модель загружается...")
                        await asyncio.sleep(3)
                        continue
                        
        except Exception as e:
            print(f"⚠️ Ошибка: {e}")
            continue
    
    return None

def generate_fallback_tale(topic):
    """Красивая длинная сказка если API не работает"""
    
    return f"""В некотором царстве, в некотором государстве жил-был {topic}. Был он не простой, а волшебный - с самого рождения умел разговаривать с ветром и понимать язык звезд.

Каждую ночь {topic} забирался на самый высокий холм и слушал, о чем шепчутся звезды. Они рассказывали ему удивительные истории о далеких мирах, о храбрых рыцарях и прекрасных принцессах, о драконах и волшебниках.

Однажды звезды поведали {topic} тайну: где-то далеко-далеко, за тридевять земель, спрятан волшебный сундук с детскими улыбками. Злой колдун заколдовал всех детей в королевстве, и они перестали улыбаться и смеяться.

{topic.title()} решил немедленно отправиться в путь. Он собрал узелок с гостинцами, попрощался с ветром и звездами и пошел туда, куда глаза глядят.

Шел он через дремучие леса, переплывал бурные реки, взбирался на высокие горы. По пути ему встретился говорящий кот, который указал дорогу к замку колдуна. Потом он повстречал мудрую сову, которая научила его не бояться темноты. А еще он подружился с веселым домовым, который рассказал, как пробраться в замок незаметно.

Наконец {topic} добрался до замка злого колдуна. С помощью новых друзей он проник внутрь, нашел волшебный сундук и открыл его. Тысячи солнечных зайчиков выпорхнули наружу и разлетелись по всему королевству, касаясь каждого ребенка.

И случилось чудо! Дети снова начали улыбаться и смеяться. Их смех был таким звонким и радостным, что даже злой колдун растаял от счастья и превратился в доброго волшебника.

С тех пор {topic} стал главным героем королевства. Каждый вечер он поднимается на холм, смотрит на звезды и рассказывает им новые истории о том, как доброта и смелость творят настоящие чудеса.

Вот и сказке конец, а кто слушал - молодец!"""

# ============ ЗАПУСК ============
if __name__ == "__main__":
    import uvicorn
    print("="*60)
    print("🔥 ГЕНЕРАТОР СКАЗОК")
    print("="*60)
    print("✅ Приложение создано")
    print("🔑 Ключи загружены")
    print("="*60)
    print("🌐 http://127.0.0.1:8000")
    print("📌 /test - проверка")
    print("="*60)
    uvicorn.run(app, host="127.0.0.1", port=8000)