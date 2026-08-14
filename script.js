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


/* =========================================================
   QR SCANNER ELEMENTS
========================================================= */

const openScannerButton =
    document.getElementById("openScanner");

const scannerModal =
    document.getElementById("scannerModal");

const scannerCloseButtons =
    document.querySelectorAll("[data-close-scanner]");

const scannerView =
    document.getElementById("scannerView");

const scanResult =
    document.getElementById("scanResult");

const scanResultIcon =
    document.getElementById("scanResultIcon");

const scanResultKicker =
    document.getElementById("scanResultKicker");

const scanResultTitle =
    document.getElementById("scanResultTitle");

const scanResultMessage =
    document.getElementById("scanResultMessage");

const scanResultDetails =
    document.getElementById("scanResultDetails");

const scanResultServer =
    document.getElementById("scanResultServer");

const scanResultSession =
    document.getElementById("scanResultSession");

const scanResultActions =
    document.getElementById("scanResultActions");

const scanAgainButton =
    document.getElementById("scanAgain");

const demoButtons =
    document.querySelectorAll("[data-demo-result]");


/* =========================================================
   NAVBAR
========================================================= */

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


/* =========================================================
   MOBILE MENU
========================================================= */

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


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

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


/* =========================================================
   PASS PREVIEW DEMO
========================================================= */

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


/* =========================================================
   QR SCANNER
========================================================= */

function resetScanner() {

    if (scannerView) {
        scannerView.hidden = false;
    }


    if (scanResult) {

        scanResult.hidden = true;

        scanResult.classList.remove(
            "is-error"
        );

    }


    if (scanResultActions) {
        scanResultActions.innerHTML = "";
    }

}


function openScanner() {

    if (!scannerModal) {
        return;
    }


    resetScanner();


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


    setTimeout(
        resetScanner,
        220
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


if (scanAgainButton) {

    scanAgainButton.addEventListener(
        "click",
        resetScanner
    );

}


/* =========================================================
   HELPERS
========================================================= */

function createActionButton(
    text,
    type,
    onClick
) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        type === "primary"
            ? "result-primary"
            : "result-secondary";


    button.textContent =
        text;


    button.addEventListener(
        "click",
        onClick
    );


    return button;

}


function clearResult() {

    if (!scanResultActions) {
        return;
    }


    scanResultActions.innerHTML =
        "";


    const oldGojo =
        scanResult.querySelector(
            ".gojo-message"
        );


    if (oldGojo) {
        oldGojo.remove();
    }

}


/* =========================================================
   SHOW QR RESULT
========================================================= */

function showScanResult(
    type,
    options = {}
) {

    if (
        !scannerView ||
        !scanResult
    ) {

        return;
    }


    clearResult();


    scannerView.hidden =
        true;


    scanResult.hidden =
        false;


    scanResult.classList.remove(
        "is-error"
    );


    const serverName =
        options.server ||
        "Discord Server";


    const sessionTime =
        options.session ||
        "активна · 04:51";


    if (scanResultServer) {
        scanResultServer.textContent =
            serverName;
    }


    if (scanResultSession) {
        scanResultSession.textContent =
            sessionTime;
    }


    /* =====================================================
       VERIFY WEB
    ===================================================== */

    if (type === "web") {

        scanResultIcon.textContent =
            "✓";


        scanResultKicker.textContent =
            "QR РАСПОЗНАН";


        scanResultTitle.textContent =
            "VERIFY WEB";


        scanResultMessage.textContent =
            "Проверка распознана. Продолжите её в браузере.";


        if (scanResultDetails) {
            scanResultDetails.hidden =
                false;
        }


        const openButton =
            createActionButton(
                "Открыть Verify Web",
                "primary",
                () => {

                    /*
                        ПОЗЖЕ:

                        window.location.href =
                            options.url;

                        Сейчас это демонстрация.
                    */

                    openButton.textContent =
                        "Открываем…";


                    setTimeout(
                        () => {

                            openButton.textContent =
                                "Verify Web открыт ✓";

                        },
                        650
                    );

                }
            );


        scanResultActions.appendChild(
            openButton
        );


        return;
    }


    /* =====================================================
       VERIFY PLUS
    ===================================================== */

    if (type === "plus") {

        scanResultIcon.textContent =
            "✓";


        scanResultKicker.textContent =
            "QR РАСПОЗНАН";


        scanResultTitle.textContent =
            "VERIFY PLUS";


        scanResultMessage.textContent =
            "Для этой проверки доступен Verify Pass или одноразовый Helper.";


        if (scanResultDetails) {
            scanResultDetails.hidden =
                false;
        }


        const passButton =
            createActionButton(
                "Открыть в Verify Pass",
                "primary",
                () => {

                    tryOpenVerifyPass();

                }
            );


        const helperButton =
            createActionButton(
                "Продолжить с Helper",
                "secondary",
                () => {

                    showHelperDemo();

                }
            );


        scanResultActions.appendChild(
            passButton
        );


        scanResultActions.appendChild(
            helperButton
        );


        return;
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (type === "error") {

        scanResult.classList.add(
            "is-error"
        );


        scanResultIcon.textContent =
            "!";


        scanResultKicker.textContent =
            "VERIFY ERROR";


        scanResultTitle.textContent =
            "Что-то пошло не так";


        scanResultMessage.textContent =
            options.message ||
            "Не удалось прочитать Verify-сессию. Попробуйте отсканировать QR ещё раз.";


        if (scanResultDetails) {
            scanResultDetails.hidden =
                true;
        }


        const retryButton =
            createActionButton(
                "Попробовать ещё раз",
                "primary",
                resetScanner
            );


        scanResultActions.appendChild(
            retryButton
        );


        const gojo =
            document.createElement(
                "div"
            );


        gojo.className =
            "gojo-message";


        gojo.innerHTML =
            getGojoMessage();


        scanResultActions.insertAdjacentElement(
            "afterend",
            gojo
        );


        return;
    }

}


/* =========================================================
   GOJO EASTER EGG
========================================================= */

function getGojoMessage() {

    const now =
        new Date();


    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    const gojoArrival =
        20 * 60 + 31;


    if (
        currentMinutes <
        gojoArrival
    ) {

        return `
            <strong>
                Годжо Сатору ещё не прибыл.
            </strong>
            <br>
            Ожидаем в 20:31.
        `;

    }


    return `
        <strong>
            20:31. Годжо Сатору уже прибыл.
        </strong>
        <br>
        Даже он пока не смог это починить.
    `;

}


/* =========================================================
   PLUS → PASS
========================================================= */

function tryOpenVerifyPass() {

    /*
        ПОКА ЭТО ДЕМО.

        В будущем здесь будет:

        1. Создаём одноразовый app-token.
        2. Пытаемся открыть deep link:
           verifypass://...
        3. Pass подтверждает открытие через backend.
        4. Если подтверждения нет —
           считаем, что Pass не установлен.
    */


    if (!scanResultActions) {
        return;
    }


    scanResultActions.innerHTML =
        "";


    const openingButton =
        createActionButton(
            "Ищем Verify Pass…",
            "primary",
            () => {}
        );


    openingButton.disabled =
        true;


    scanResultActions.appendChild(
        openingButton
    );


    setTimeout(
        () => {

            showPassNotInstalled();

        },
        1300
    );

}


/* =========================================================
   PASS NOT INSTALLED
========================================================= */

function showPassNotInstalled() {

    if (!scanResultActions) {
        return;
    }


    scanResultActions.innerHTML =
        "";


    scanResultMessage.textContent =
        "Verify Pass не найден. Можно установить его или продолжить через Helper.";


    const installButton =
        createActionButton(
            "Установить Verify Pass",
            "primary",
            () => {

                showInstallCode();

            }
        );


    const helperButton =
        createActionButton(
            "Использовать Helper",
            "secondary",
            () => {

                showHelperDemo();

            }
        );


    scanResultActions.appendChild(
        installButton
    );


    scanResultActions.appendChild(
        helperButton
    );

}


/* =========================================================
   INSTALLATION CONTINUATION CODE
========================================================= */

function showInstallCode() {

    if (!scanResultActions) {
        return;
    }


    const continuationCode =
        generateContinuationCode();


    scanResultMessage.innerHTML =
        `
            Устанавливаете Verify Pass?
            <br>
            Мы сохранили эту проверку.
        `;


    scanResultActions.innerHTML =
        `
            <div
                style="
                    padding: 18px;
                    border: 1px solid rgba(109,124,255,.22);
                    border-radius: 14px;
                    background: rgba(109,124,255,.055);
                    text-align: center;
                "
            >

                <span
                    style="
                        display: block;
                        color: #657080;
                        font-size: 9px;
                        font-weight: 800;
                        letter-spacing: 1px;
                    "
                >
                    КОД ПРОДОЛЖЕНИЯ
                </span>

                <strong
                    style="
                        display: block;
                        margin-top: 8px;
                        color: #c9ceff;
                        font-size: 27px;
                        letter-spacing: 3px;
                    "
                >
                    ${continuationCode}
                </strong>

                <span
                    style="
                        display: block;
                        margin-top: 8px;
                        color: #657080;
                        font-size: 10px;
                    "
                >
                    Действителен 15 минут
                </span>

            </div>
        `;


    const downloadButton =
        createActionButton(
            "Скачать Verify Pass",
            "primary",
            () => {

                /*
                    Позже здесь будет
                    реальная страница загрузки.
                */

                alert(
                    "Здесь откроется страница загрузки Verify Pass."
                );

            }
        );


    scanResultActions.appendChild(
        downloadButton
    );

}


/* =========================================================
   GENERATE CODE
========================================================= */

function generateContinuationCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let code =
        "VFY-";


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        code +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }


    return code;

}


/* =========================================================
   HELPER DEMO
========================================================= */

function showHelperDemo() {

    if (!scanResultActions) {
        return;
    }


    scanResultMessage.textContent =
        "Helper выбран. В полной версии Verify здесь начнётся одноразовая Helper-сессия.";


    scanResultActions.innerHTML =
        "";


    const helperButton =
        createActionButton(
            "Запустить Helper",
            "primary",
            () => {

                helperButton.textContent =
                    "Helper готов ✓";


                helperButton.disabled =
                    true;

            }
        );


    scanResultActions.appendChild(
        helperButton
    );

}


/* =========================================================
   DEMO QR BUTTONS
========================================================= */

demoButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const resultType =
                button.dataset.demoResult;


            if (
                resultType ===
                "web"
            ) {

                showScanResult(
                    "web",
                    {
                        server:
                            "NovaTime",

                        session:
                            "активна · 04:51"
                    }
                );

                return;
            }


            if (
                resultType ===
                "plus"
            ) {

                showScanResult(
                    "plus",
                    {
                        server:
                            "NovaTime",

                        session:
                            "активна · 04:51"
                    }
                );

                return;
            }


            showScanResult(
                "error"
            );

        }
    );

});


/* =========================================================
   FUTURE REAL QR API

   Настоящий QR scanner потом сможет просто вызвать:

   handleVerifyQr({
       type: "web",
       server: "NovaTime",
       session: "04:51"
   });

   И UI уже готов.
========================================================= */

function handleVerifyQr(data) {

    if (!data) {

        showScanResult(
            "error",
            {
                message:
                    "QR-код не содержит Verify-сессию."
            }
        );

        return;
    }


    if (
        data.type ===
        "web"
    ) {

        showScanResult(
            "web",
            {
                server:
                    data.server ||
                    "Discord Server",

                session:
                    data.session
                        ? `активна · ${data.session}`
                        : "активна"
            }
        );

        return;
    }


    if (
        data.type ===
        "plus"
    ) {

        showScanResult(
            "plus",
            {
                server:
                    data.server ||
                    "Discord Server",

                session:
                    data.session
                        ? `активна · ${data.session}`
                        : "активна"
            }
        );

        return;
    }


    showScanResult(
        "error",
        {
            message:
                "Этот QR-код не поддерживается Verify."
        }
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


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
);


/* =========================================================
   RESIZE
========================================================= */

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


/* =========================================================
   DEVELOPMENT API

   Можно открыть DevTools и проверить:

   VerifyDemo.web()
   VerifyDemo.plus()
   VerifyDemo.error()

========================================================= */

window.VerifyDemo = {

    web() {

        openScanner();


        setTimeout(
            () => {

                showScanResult(
                    "web",
                    {
                        server:
                            "NovaTime",

                        session:
                            "активна · 04:51"
                    }
                );

            },
            200
        );

    },


    plus() {

        openScanner();


        setTimeout(
            () => {

                showScanResult(
                    "plus",
                    {
                        server:
                            "NovaTime",

                        session:
                            "активна · 04:51"
                    }
                );

            },
            200
        );

    },


    error() {

        openScanner();


        setTimeout(
            () => {

                showScanResult(
                    "error"
                );

            },
            200
        );

    }

};
