// ============ ДЕМО-РЕЖИМ С РАБОЧИМИ СКАЗКАМИ ============
// Все сказки генерируются прямо в браузере

document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const taleText = document.getElementById('taleText');
    const taleImage = document.getElementById('taleImage');

    // Коллекция красивых сказок для разных тем
    const tales = [
        {
            keywords: ['лес', 'дракон', 'огонь', 'зверь'],
            tale: `В некотором царстве, в некотором государстве жил-был дракон по имени Искорка. Он был не простым драконом — вместо огня он выдыхал разноцветные искры счастья.

Каждое утро Искорка просыпался и облетал волшебный лес, даря зверятам свои искорки. Зайчата становились веселее, бельчата — шустрее, а птицы пели звонче.

Однажды в лесу появилась грустная фея, которая потеряла свои крылышки. Она сидела на поляне и горько плакала. Искорка подлетел к ней, обнял своим пушистым хвостом и подарил самую яркую искорку.

И случилось чудо! У феи выросли новые крылья — еще красивее прежних. Они сверкали на солнце всеми цветами радуги.

С тех пор дракончик и фея стали лучшими друзьями. Каждую ночь они поднимаются на самую высокую гору и зажигают на небе новые звезды, чтобы всем детям на земле было светло и радостно.

Вот и сказке конец, а кто слушал — молодец!`,
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'
        },
        {
            keywords: ['фея', 'цветок', 'сад', 'растение'],
            tale: `В одном волшебном саду, где цветы светятся в темноте, а бабочки поют песни, жила маленькая фея по имени Розочка. У нее были прозрачные крылышки, которые переливались всеми цветами радуги.

Каждое утро фея просыпалась с первыми лучами солнца и принималась за работу. Она поливала цветы волшебной росой, расправляла лепестки у сонных бутонов и будила пчелок.

В саду рос один особенный цветок — Золотой Лотос. Он распускался только раз в сто лет и исполнял одно заветное желание. И вот настал тот самый день!

Розочка долго думала, что же загадать. Можно было стать самой красивой феей, или получить горы сладостей, или научиться летать быстрее ветра. Но фея загадала, чтобы все дети на земле были счастливы.

Лепестки лотоса ярко вспыхнули, и по всему миру разлетелись золотые искорки. С тех пор каждый раз, когда ребенок улыбается, в волшебном саду распускается новый прекрасный цветок.

И живут они там до сих пор долго и счастливо!`,
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800'
        },
        {
            keywords: ['кот', 'кошка', 'животное', 'зверь'],
            tale: `В одном уютном городке, где дома были разноцветными, а улицы всегда чистыми, жил говорящий кот по имени Мурзик. Он был не простым котом — он умел понимать язык ветра и разговаривать со звездами.

Каждую ночь Мурзик забирался на крышу самого высокого дома и слушал, о чем шепчутся звезды. Они рассказывали ему удивительные истории о далеких мирах, о храбрых рыцарях и прекрасных принцессах.

Однажды звезды поведали коту тайну: где-то далеко-далеко, за тридевять земель, спрятан волшебный сундук с детскими улыбками. Злой колдун заколдовал всех детей в соседнем королевстве, и они перестали смеяться.

Мурзик решил немедленно отправиться в путь. Он собрал узелок с вяленой рыбкой, попрощался с ветром и звездами и пошел туда, куда глаза глядят.

Шел он через дремучие леса, переплывал бурные реки, взбирался на высокие горы. По пути ему встретился мудрый филин, который указал дорогу к замку колдуна. Потом он повстречал веселого щенка, который научил его не бояться темноты. А еще он подружился с добрым ежиком, который рассказал, как пробраться в замок незаметно.

Наконец Мурзик добрался до замка злого колдуна. С помощью новых друзей он проник внутрь, нашел волшебный сундук и открыл его. Тысячи солнечных зайчиков выпорхнули наружу и разлетелись по всему королевству, касаясь каждого ребенка.

И случилось чудо! Дети снова начали улыбаться и смеяться. Их смех был таким звонким и радостным, что даже злой колдун растаял от счастья и превратился в доброго волшебника.

С тех пор Мурзик стал главным героем королевства. Каждый вечер он поднимается на крышу, смотрит на звезды и рассказывает им новые истории о том, как доброта и смелость творят настоящие чудеса.`,
            image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800'
        },
        {
            keywords: ['принцесса', 'принц', 'король', 'королева'],
            tale: `В тридевятом царстве, в тридесятом государстве жила-была принцесса по имени Василиса. Она была не только красивой, но и очень доброй. Каждый день она помогала своим подданным: лечила больных зверят, мирила поссорившихся друзей, дарила улыбки грустным прохожим.

Но вот беда — злая колдунья завидовала доброте принцессы и решила ее заколдовать. Она превратила Василису в лягушку и спрятала на болоте.

Узнал об этом Иван-царевич из соседнего королевства и отправился спасать принцессу. Долго шел он через дремучие леса, высокие горы и глубокие овраги. По пути ему встречались разные звери, и всем он помогал: зайца от лисы спас, медведю лапу перевязал, лисе хвост распутал.

Звери отблагодарили Ивана — указали дорогу к болоту, где пряталась заколдованная принцесса. Нашел Иван лягушку, поцеловал ее — и в тот же миг обернулась она прекрасной Василисой.

Вернулись они во дворец, сыграли свадьбу и жили долго и счастливо. А злая колдунья от их доброты тоже подобрела и стала печь самые вкусные пирожки во всем королевстве.`,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
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
            showNotification('Пожалуйста, введите тему сказки!', 'warning');
            return;
        }

        // Показываем загрузку
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        generateBtn.disabled = true;

        // Имитируем загрузку (как будто нейросеть работает)
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
            taleImage.alt = `Иллюстрация к сказке о ${topic}`;
            
            result.classList.remove('hidden');
            loading.classList.add('hidden');
            generateBtn.disabled = false;

            // Показываем уведомление об успехе
            showNotification('✨ Сказка успешно создана!', 'success');

            // Плавный скролл к результату
            setTimeout(() => {
                result.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }, 2000); // 2 секунды загрузки
    }

    // Функция показа уведомлений
    function showNotification(message, type) {
        // Удаляем предыдущее уведомление если есть
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        else if (type === 'error') icon = '❌';
        else if (type === 'warning') icon = '⚠️';
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                         type === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 
                         'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'};
            border-radius: 50px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

// Добавляем анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
