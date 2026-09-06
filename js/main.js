// BURGER-MENU
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".burger_btn").addEventListener("click", () => {
        document.querySelector(".navigation_block").classList.add("open")
    })
})

document.querySelector(".nav_menu").addEventListener("click", event => {
    event._isClickWithInMenu = true;
});
document.querySelector(".burger_btn").addEventListener("click", event => {
    event._isClickWithInMenu = true;
});
document.body.addEventListener("click", event => {
    if (event._isClickWithInMenu) return;
    document.querySelector(".navigation_block").classList.remove("open");
});
document.querySelector(".burger_close_btn").addEventListener("click", event => {
    if (event._isClickWithInMenu) return;
    document.querySelector(".navigation_block").classList.remove("open");
});

// Появление текста при нажатии на "Подробнее"

const allServicesMore = document.querySelectorAll('.service_more');

allServicesMore.forEach(el => {
    el.addEventListener('click', () => {
        el.classList.add('invisible');
        el.closest('.service').classList.add('service_active');
        el.nextElementSibling.classList.add('visible');
        el.closest('.service').lastElementChild.classList.add('service_img_small');
    })
});

// Появление формы обратной связи

const allAssessments = document.querySelectorAll('.assessment_img');

allAssessments.forEach(el => {
    el.addEventListener('click', () => {
        allAssessments.forEach(e => {
            e.classList.add('assessment_img_passive');
        })
        document.querySelector('.feedback_form').classList.add('visible');
        el.classList.remove('assessment_img_passive');
    })
})

// Счетчик символов в форме обратной связи

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('.suggestions');
    const charCountElement = document.querySelector('.char_counter');

    textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const remainingLength = 300 - currentLength;
        charCountElement.textContent = currentLength + '/' + 300;
    });
});