// https://kenwheeler.github.io/slick/

$(document).ready(function(){
    $('.carousel').slick({
        autoplay: true,
        centerMode: true,
        arrows: true,
        dots: true,
        initialSlide: 1,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });
});

