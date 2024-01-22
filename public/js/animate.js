//ANIMATE EFFECT
function isInView(element) {
    const rect = element.getBoundingClientRect();
    const elementCenter = (rect.top + rect.bottom) / 2;
    return (
        elementCenter >= window.innerHeight / 5 &&
        elementCenter <= (4 * window.innerHeight) / 4
    );
}
function handleAnimation() {
    const left = document.querySelector('.front-skills');
    const right = document.querySelector('.social-skills');  
    if (isInView(left)) {
        left.classList.add('animate__animated', 'animate__fadeInLeft');
    } else {
        left.classList.remove('animate__animated', 'animate__fadeInLeft');
    }
    if (isInView(right)) {
        right.classList.add('animate__animated', 'animate__fadeInRight');
    } else {
        right.classList.remove('animate__animated', 'animate__fadeInRight');
    }
}
window.addEventListener('scroll', handleAnimation);
window.addEventListener('load', handleAnimation);

