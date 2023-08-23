const circleImage = document.getElementById('circleImage');
const circleDiv = document.querySelector('.circle');

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const circleRect = circleDiv.getBoundingClientRect();

    if (mouseX < circleRect.left) {
        circleImage.src = preloadedImages.left.src;
    } else if (mouseX > circleRect.right) {
        circleImage.src = preloadedImages.right.src;
    } else if (mouseY > circleRect.bottom) {
        circleImage.src = preloadedImages.down.src;
    } else {
        circleImage.src = preloadedImages.front.src;
    }
});