const circleImage = document.getElementById('circleImage');
const circleDiv = document.querySelector('.circle');
const leftImage = 'images/left.jpg';
const rightImage = 'images/right.jpg';
const frontImage = 'images/front.jpg';
const downImage = 'images/down.jpg';

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const circleRect = circleDiv.getBoundingClientRect();

    if (mouseX < circleRect.left) {
        circleImage.src = leftImage;
    } else if (mouseX > circleRect.right) {
        circleImage.src = rightImage;
    } else if (mouseY > circleRect.bottom) {
        circleImage.src = downImage;
    } else {
        circleImage.src = frontImage;
    }
});