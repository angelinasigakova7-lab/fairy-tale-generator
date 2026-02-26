

document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const taleText = document.getElementById('taleText');
    const taleImage = document.getElementById('taleImage');

    // Красивые демо-сказки для разных тем
    const tales = [
        {
            keywords: ['лес', 'дракон', 'волшебный'],
            tale: `В одном волшебном лесу, где деревья доставали до облаков, а ручьи журчали волшебные мелодии, жил был маленький дракончик по имени Искорка. Он был не обычным драконом — вместо огня он выдыхал разноцветные искры счастья.

Однажды Искорка встретил грустную фею, которая потеряла свои крылышки. Дракончик не растерялся — он позвал на помощь ветер, солнце и звезды. Вместе они сделали для феи новые крылья из лунного света и утренней росы.

С тех пор фея и дракончик стали лучшими друзьями. Каждую ночь они поднимаются на самую высокую гору и зажигают на небе новые звезды, чтобы всем детям на земле было светло и радостно.`,
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'
        },
        {
            keywords: ['фея', 'цветок', 'сад'],
            tale: `В далекой волшебной стране, где цветы светятся в темноте, а бабочки поют песни, жила маленькая фея по имени Розочка. У нее были прозрачные крылышки, которые переливались всеми цветами радуги.

Каждое утро фея поливала волшебный сад, где росли самые удивительные цветы. Однажды она нашла цветок, который светился особенно ярко — это был Цветок Желаний. Розочка загадала, чтобы все дети на земле были счастливы.

И случилось чудо! С тех пор каждый раз, когда ребенок улыбается, в волшебном саду распускается новый прекрасный цветок.`,
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800'
        },
        {
            keywords: ['кот', 'кошка', 'животное'],
            tale: `В одном уютном городке жил говорящий кот по имени Мурзик. Он был не простым котом — он умел понимать язык ветра и разговаривать со звездами.

Однажды ночью звезды рассказали ему, что где-то далеко спрятан волшебный сундук с детскими улыбками. Злой волшебник заколдовал детей в соседнем королевстве, и они перестали смеяться.

Мурзик отправился в путешествие. По пути он встретил мудрую сову, веселого щенка и доброго ежика. Вместе они нашли сундук и вернули улыбки всем детям. С тех пор в том королевстве каждый день звучит звонкий детский смех.`,
            image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800'
        }
    ];

    // Красивые картинки на любой случай
    const fallbackImages = [
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
    ];

    generateBtn.addEventListener('click', generateTale);
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateTale();
    });

    function generateTale() {
        const topic = topicInput.value.trim().toLowerCase();
        
        if (!topic) {
            alert('Пожалуйста, введите тему сказки!');
            return;
        }

        // Показываем загрузку
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        generateBtn.disabled = true;

        // Имитируем загрузку (как будто бэкенд работает)
        setTimeout(() => {
            // Ищем подходящую сказку по ключевым словам
            let selectedTale = null;
            for (const item of tales) {
                if (item.keywords.some(keyword => topic.includes(keyword))) {
                    selectedTale = item;
                    break;
                }
            }

            // Если не нашли подходящую, используем случайную
            if (!selectedTale) {
                selectedTale = tales[Math.floor(Math.random() * tales.length)];
            }

            // Выбираем случайную картинку
            const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

            // Отображаем результат
            taleText.innerHTML = selectedTale.tale.replace(/\n/g, '<br>');
            taleImage.src = selectedTale.image || randomImage;
            
            result.classList.remove('hidden');
            loading.classList.add('hidden');
            generateBtn.disabled = false;

            // Плавный скролл к результату
            result.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2000); // 2 секунды загрузки
    }
});
