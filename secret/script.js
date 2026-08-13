// ========================================
// ELEMENTS
// ========================================

const navbar =
    document.querySelector(".navbar");

const openRecipe =
    document.getElementById("openRecipe");

const recipe =
    document.getElementById("recipe");

const agentButtons =
    document.querySelectorAll(".agent-expand");


// ========================================
// NAVBAR
// ========================================

function updateNavbar() {

    if (window.scrollY > 20) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    updateNavbar
);


updateNavbar();


// ========================================
// OPEN RECIPE
// ========================================

openRecipe.addEventListener(
    "click",
    () => {

        recipe.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// ========================================
// AGENT DETAILS
// ========================================

agentButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(".agent-card");


                card.classList.toggle("open");

            }
        );

    }
);


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements = [

    ...document.querySelectorAll(
        ".story-content"
    ),

    ...document.querySelectorAll(
        ".flow-item"
    ),

    ...document.querySelectorAll(
        ".agent-card"
    ),

    ...document.querySelectorAll(
        ".data-table-wrapper"
    ),

    ...document.querySelectorAll(
        ".no-data-item"
    ),

    ...document.querySelectorAll(
        ".code-window"
    ),

    ...document.querySelectorAll(
        ".transparency-rule"
    )

];


revealElements.forEach(
    (element) => {

        element.classList.add("reveal");

    }
);


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add("visible");


                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {
            threshold: 0.08
        }

    );


revealElements.forEach(
    (element) => {

        observer.observe(element);

    }
);


// ========================================
// SECRET TITLE EFFECT
// ========================================

const secretTitle =
    document.querySelector(
        ".strike-secret"
    );


if (secretTitle) {

    secretTitle.addEventListener(
        "click",
        () => {

            secretTitle.textContent =
                "NICE TRY.";

            setTimeout(
                () => {

                    secretTitle.textContent =
                        "ЭТО ЗАСЕКРЕЧЕНО";

                },
                1200
            );

        }
    );

}
