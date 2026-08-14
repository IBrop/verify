const navbar =
    document.querySelector(".navbar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const sections =
    document.querySelectorAll("main section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");

const confirmButtons =
    document.querySelectorAll(".confirm-button");


const openScannerButton =
    document.getElementById("openScanner");

const scannerModal =
    document.getElementById("scannerModal");

const scannerCloseButtons =
    document.querySelectorAll("[data-close-scanner]");


/* NAVBAR SCROLL */

function updateNavbar() {

    if (!navbar) {
        return;
    }

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 20
    );
}


window.addEventListener(
    "scroll",
    updateNavbar
);


updateNavbar();


/* MOBILE MENU */

if (
    mobileMenuButton &&
    mobileMenu
) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList.toggle("open");


            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    document
        .querySelectorAll(".mobile-menu a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.remove(
                        "open"
                    );


                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}


/* ACTIVE NAV SECTION */

function updateActiveSection() {

    let currentSection =
        "home";


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;


        if (
            window.scrollY >=
            sectionTop
        ) {

            currentSection =
                section.id;

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove(
            "active"
        );


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveSection
);


updateActiveSection();


/* PASS DEMO BUTTON */

confirmButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const oldText =
                button.textContent;


            button.textContent =
                "Готово ✓";


            button.disabled =
                true;


            setTimeout(
                () => {

                    button.textContent =
                        oldText;


                    button.disabled =
                        false;

                },
                2500
            );

        }
    );

});


/* QR SCANNER MODAL */

function openScanner() {

    if (!scannerModal) {
        return;
    }


    scannerModal.classList.add(
        "open"
    );


    scannerModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function closeScanner() {

    if (!scannerModal) {
        return;
    }


    scannerModal.classList.remove(
        "open"
    );


    scannerModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


if (openScannerButton) {

    openScannerButton.addEventListener(
        "click",
        openScanner
    );

}


scannerCloseButtons.forEach((button) => {

    button.addEventListener(
        "click",
        closeScanner
    );

});


/* ESC */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            closeScanner();


            if (
                mobileMenu &&
                mobileMenuButton
            ) {

                mobileMenu.classList.remove(
                    "open"
                );


                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    }
);


/* RESIZE */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 1120 &&
            mobileMenu &&
            mobileMenuButton
        ) {

            mobileMenu.classList.remove(
                "open"
            );


            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);
