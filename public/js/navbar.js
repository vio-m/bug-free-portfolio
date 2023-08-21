const navbar = document.getElementById("navbar");
const burgerMenu = document.getElementById("burger-menu");
const closeBtn = document.getElementById("close-btn");


burgerMenu.addEventListener("click", () => {
    navbar.classList.toggle("expanded");
});

navbar.querySelectorAll("ul li a").forEach((item) => {
    item.addEventListener("click", () => {
        navbar.classList.remove("expanded");
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
        console.log(">>> small")
        navbar.classList.add("small");
    } else {
        console.log(">>> big")
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


