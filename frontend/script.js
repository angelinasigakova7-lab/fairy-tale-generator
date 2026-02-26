const API_URL = 'http://localhost:8000';  

document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const taleText = document.getElementById('taleText');
    const taleImage = document.getElementById('taleImage');

    // Добавляем эффекты при фокусе
    topicInput.addEventListener('focus', () => {
        document.querySelector('.input-container').style.transform = 'scale(1.02)';
    });

    topicInput.addEventListener('blur', () => {
        document.querySelector('.input-container').style.transform = 'scale(1)';
    });

    generateBtn.addEventListener('click', generateTale);
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateTale();
    });

    async function generateTale() {
        const topic = topicInput.value.trim();
        
        if (!topic) {
            showNotification('Пожалуйста, введите тему сказки!', 'error');
            return;
        }

        // Показываем загрузку
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        generateBtn.disabled = true;
        
        // Анимация кнопки
        generateBtn.style.transform = 'scale(0.95)';

        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic })
            });

            if (!response.ok) {
                throw new Error('Ошибка генерации');
            }

            const data = await response.json();
            
            // Плавное появление результата
            taleText.innerHTML = data.tale.replace(/\n/g, '<br>');
            
            if (data.image_url) {
                taleImage.src = data.image_url;
            } else {
                taleImage.src = `https://source.unsplash.com/featured/512x512/?fantasy,magic,${topic.replace(' ', ',')}`;
            }
            
            result.classList.remove('hidden');
            result.style.animation = 'fadeInUp 0.5s ease-out';
            
            // Плавный скролл к результату
            setTimeout(() => {
                result.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            showNotification('Сказка успешно создана!', 'success');

        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Что-то пошло не так. Пробую демо-режим...', 'warning');
            demoMode(topic);
        } finally {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.style.transform = 'scale(1)';
        }
    }

    function demoMode(topic) {
        const tales = [
            `Волшебный ${topic}\n\nВ тридевятом царстве, в тридесятом государстве жил-был удивительный ${topic}. Каждое утро он просыпался и начинал творить чудеса.\n\nОднажды к нему прилетела фея и сказала: "Ты самый особенный ${topic} во всем мире!" И с тех пор они стали лучшими друзьями.`,
            
            `Приключения ${topic}\n\nЖил на свете ${topic}, который очень любил путешествовать. Однажды он отправился в Страну Забытых Снов.\n\nТам он встретил грустного дракона и подарил ему волшебную пыльцу счастья. Дракон взлетел выше облаков!\n\nС тех пор ${topic} хранит золотое перо Жар-птицы как напоминание о том, что доброта творит чудеса.`
        ];
        
        const randomTale = tales[Math.floor(Math.random() * tales.length)];
        taleText.innerHTML = randomTale.replace(/\n/g, '<br>');
        
        taleImage.src = `https://source.unsplash.com/featured/512x512/?magic,fairytale,${topic.replace(' ', ',')}`;
        taleImage.alt = `Иллюстрация к сказке о ${topic}`;
        
        result.classList.remove('hidden');
        showNotification('Демо-режим: сказка создана без AI', 'info');
    }

    function showNotification(message, type) {
        // Удаляем предыдущее уведомление если есть
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        else if (type === 'error') icon = 'exclamation-circle';
        else if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

// Добавляем анимации в CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);