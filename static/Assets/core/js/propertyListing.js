var swiper2 = new Swiper(".mainSwiper", {
    spaceBetween: 10,
    slidesPerView: 1,
    autoplay: {
        delay: 10000,
        disableOnInteraction: false
    },
    thumbs: {
        swiper: swiper,
    },
    navigation: {
        nextEl: ".mainswiper-button-next",
        prevEl: ".mainswiper-button-prev",
    },
    breakpoints: {
        768: {
        }
    }
});