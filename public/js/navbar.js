const navbar = document.getElementById("navbar");
const burgerMenu = document.getElementById("burger-menu");
const closeBtn = document.getElementById("close-btn");


burgerMenu.addEventListener("click", () => {
    navbar.classList.toggle("expanded");
});

navbar.querySelectorAll(".link-container a").forEach((item) => {
    item.addEventListener("click", () => {
        navbar.classList.remove("expanded");
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
        navbar.classList.add("small");
    } else {
        navbar.classList.remove("small");
    }
});

navbar.addEventListener("mouseenter", () => {
    navbar.classList.remove("small");
});

navbar.addEventListener("mouseleave", () => {
    if (window.scrollY > 0) {
        navbar.classList.add("small");
    }
});

closeBtn.addEventListener("click", () => {
    navbar.classList.remove("expanded");
});


