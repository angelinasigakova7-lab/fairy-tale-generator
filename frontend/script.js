
const API_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const taleText = document.getElementById('taleText');
    const taleImage = document.getElementById('taleImage');

    generateBtn.addEventListener('click', generateTale);
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateTale();
    });

    async function generateTale() {
        const topic = topicInput.value.trim();
        
        if (!topic) {
            alert('Введите тему сказки');
            return;
        }

        loading.classList.remove('hidden');
        result.classList.add('hidden');
        generateBtn.disabled = true;

        try {
            const response = await fetch(`/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic })
            });

            const data = await response.json();
            
            taleText.innerHTML = data.tale.replace(/\n/g, '<br>');
            
            if (data.image_base64) {
                taleImage.src = `data:image/jpeg;base64,${data.image_base64}`;
            } else {
                taleImage.src = 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800';
            }
            
            result.classList.remove('hidden');

        } catch (error) {
            console.error('Ошибка:', error);
            alert('Что-то пошло не так');
        } finally {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
});
