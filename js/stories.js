// СПИСОК ДАННЫХ СТОРИС

const storiesData = [{
    id: 1,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_1.png',
    video: 'intermet_new/video/1.mp4'
}, {
    id: 2,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_2.png',
    video: 'intermet_new/video/2.mp4'
}, {
    id: 3,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_3.png',
    video: 'intermet_new/video/3.mp4'
}, {
    id: 4,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_4.png',
    video: 'intermet_new/video/4.mp4'
}, {
    id: 5,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_1.png',
    video: 'intermet_new/video/5.mp4'
}, {
    id: 6,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_1.png',
    video: 'intermet_new/video/6.mp4'
}, {
    id: 7,
    title: 'ЗАГОЛОВОК СТОРИС',
    preview: 'intermet_new/imgs/story_img_1.png',
    video: 'intermet_new/video/7.mp4'
}];

// ---- DOM ----
const grid = document.getElementById('storiesGrid');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopupBtn');
const video = document.getElementById('storyVideo');
const centerPlayBtn = document.getElementById('centerPlayBtn');
const videoWrapper = document.getElementById('videoWrapper');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const storyCounter = document.getElementById('storyCounter');
const prevBtn = document.getElementById('prevStory');
const nextBtn = document.getElementById('nextStory');

let isPopupOpen = false;
let isPlaying = false;
let currentIndex = 0;
let isDragging = false;
let autoPlayTimer = null;

// ---- ОБНОВЛЕНИЕ КНОПОК ----
function updatePlayButtons(playing) {
    if (!playing) {
        centerPlayBtn.classList.add('visible');
    } else {
        centerPlayBtn.classList.remove('visible');
    }
    isPlaying = playing;
}

// ---- ЗАГРУЗКА СТОРИС ----
function loadStory(index) {
    const story = storiesData[index];
    if (!story) return;

    currentIndex = index;
    video.src = story.video;
    video.load();
    updateCounter();
    updateProgress(0);

    // Автозапуск
    setTimeout(() => {
        video.play().then(() => {
            updatePlayButtons(true);
            startAutoProgress();
        }).catch(() => {
            updatePlayButtons(false);
            stopAutoProgress();
        });
    }, 200);
}

// ---- ПРОГРЕСС ----
function updateProgress(value) {
    const percent = Math.min(100, Math.max(0, value));
    progressFill.style.width = percent + '%';
}

function startAutoProgress() {
    stopAutoProgress();
    autoPlayTimer = setInterval(() => {
        if (!video.paused && !isDragging && video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            updateProgress(percent);
        }
    }, 100);
}

function stopAutoProgress() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

// ---- ПЕРЕКЛЮЧЕНИЕ ----
function nextStory() {
    if (currentIndex < storiesData.length - 1) {
        loadStory(currentIndex + 1);
    } else {
        closePopup();
    }
}

function prevStory() {
    if (currentIndex > 0) {
        loadStory(currentIndex - 1);
    }
}

function updateCounter() {
    storyCounter.textContent = `${currentIndex + 1} / ${storiesData.length}`;
}

// ---- ПЕРЕКЛЮЧЕНИЕ PLAY/PAUSE ----
function togglePlay() {
    if (video.paused) {
        video.play().then(() => {
            updatePlayButtons(true);
            startAutoProgress();
        }).catch((err) => {
            console.warn('Play не удался:', err);
            updatePlayButtons(false);
        });
    } else {
        video.pause();
        updatePlayButtons(false);
        stopAutoProgress();
    }
}

// ---- ОТКРЫТИЕ ПОПАПА ----
function openPopup(index) {
    if (isPopupOpen) return;
    isPopupOpen = true;
    currentIndex = index;

    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    loadStory(index);
}

// ---- ЗАКРЫТИЕ ПОПАПА ----
function closePopup() {
    if (!isPopupOpen) return;
    isPopupOpen = false;

    popupOverlay.classList.remove('active');
    stopAutoProgress();

    setTimeout(() => {
        video.pause();
        updatePlayButtons(false);
        centerPlayBtn.classList.remove('visible');
        video.src = '';
        updateProgress(0);
    }, 400);

    document.body.style.overflow = '';
}

// ---- СОЗДАНИЕ ЭЛЕМЕНТОВ СТОРИС ----
function renderStories() {
    grid.innerHTML = '';
    storiesData.forEach((story, index) => {
        const item = document.createElement('div');
        item.className = 'story-item';
        item.dataset.index = index;

item.innerHTML = `
<div class="story">
    <div class="story_view">
        <img src="${story.preview}" alt="Изображение" class="story_img">
    </div>
    <span class="story_text">${story.title}</span>
</div>
`;


        item.addEventListener('click', function(e) {
            e.preventDefault();
            const idx = parseInt(this.dataset.index);
            openPopup(idx);
        });

        grid.appendChild(item);
    });
}

// ---- ОБРАБОТЧИКИ ----

// Закрытие
closePopupBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closePopup();
});

popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isPopupOpen) closePopup();
    if (e.key === 'ArrowRight' && isPopupOpen) nextStory();
    if (e.key === 'ArrowLeft' && isPopupOpen) prevStory();
});

// Навигация
nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    nextStory();
});

prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    prevStory();
});

// Клик по видео
videoWrapper.addEventListener('click', function(e) {
    if (e.target.closest('.close-popup')) return;
    if (e.target.closest('.nav-arrow')) return;
    if (e.target.closest('.progress-bar')) return;
    if (e.target.closest('#centerPlayBtn')) return;
    if (!video.src) return;
    togglePlay();
});

// Ползунок
progressBar.addEventListener('mousedown', function(e) {
    e.stopPropagation();
    isDragging = true;
    updateProgressFromEvent(e);
    video.pause();
    updatePlayButtons(false);
    stopAutoProgress();
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        updateProgressFromEvent(e);
    }
});

document.addEventListener('mouseup', function(e) {
    if (isDragging) {
        isDragging = false;
        if (video.duration) {
            const percent = parseFloat(progressFill.style.width) / 100;
            video.currentTime = percent * video.duration;
            if (!video.paused) {
                startAutoProgress();
            }
        }
    }
});

// Touch события для мобильных
progressBar.addEventListener('touchstart', function(e) {
    e.stopPropagation();
    isDragging = true;
    updateProgressFromTouch(e);
    video.pause();
    updatePlayButtons(false);
    stopAutoProgress();
});

document.addEventListener('touchmove', function(e) {
    if (isDragging) {
        updateProgressFromTouch(e);
    }
});

document.addEventListener('touchend', function(e) {
    if (isDragging) {
        isDragging = false;
        if (video.duration) {
            const percent = parseFloat(progressFill.style.width) / 100;
            video.currentTime = percent * video.duration;
            if (!video.paused) {
                startAutoProgress();
            }
        }
    }
});

function updateProgressFromEvent(e) {
    const rect = progressBar.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const percent = Math.min(1, Math.max(0, x));
    updateProgress(percent * 100);
}

function updateProgressFromTouch(e) {
    const touch = e.touches[0];
    const rect = progressBar.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const percent = Math.min(1, Math.max(0, x));
    updateProgress(percent * 100);
}

// События видео
video.addEventListener('play', function() {
    updatePlayButtons(true);
    startAutoProgress();
});

video.addEventListener('pause', function() {
    updatePlayButtons(false);
    stopAutoProgress();
});

video.addEventListener('ended', function() {
    updatePlayButtons(false);
    stopAutoProgress();
    updateProgress(100);
    // Автоматическое переключение
    setTimeout(() => {
        if (isPopupOpen) {
            nextStory();
        }
    }, 500);
});

video.addEventListener('timeupdate', function() {
    if (!isDragging && video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        updateProgress(percent);
    }
});

video.addEventListener('error', function() {
    console.warn('Видео не загружено');
    centerPlayBtn.classList.remove('visible');
});

// ---- ИНИЦИАЛИЗАЦИЯ ----
renderStories();
popupOverlay.setAttribute('tabindex', '-1');