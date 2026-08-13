const navbar = document.querySelector(".navbar");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");


// =========================
// NAVBAR SCROLL
// =========================

function updateNavbar() {
    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateNavbar);

updateNavbar();


// =========================
// MOBILE MENU
// =========================

mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});


document.querySelectorAll(".mobile-menu a").forEach((link) => {

    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
    });

});


// =========================
// ACTIVE NAV SECTION
// =========================

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");


function updateActiveSection() {

    let currentSection = "home";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${currentSection}`) {
            link.classList.add("active");
        }

    });

}


window.addEventListener("scroll", updateActiveSection);

updateActiveSection();


// =========================
// DEMO CONFIRM BUTTON
// =========================

const confirmButtons =
    document.querySelectorAll(".pass-server button");


confirmButtons.forEach((button) => {

    if (button.textContent.trim() !== "Confirm") {
        return;
    }


    button.addEventListener("click", () => {

        const oldText = button.textContent;

        button.textContent = "Verified ✓";

        button.disabled = true;


        setTimeout(() => {

            button.textContent = oldText;

            button.disabled = false;

        }, 2500);

    });

});
