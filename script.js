/*
=========================================================
VERIFY FRONTEND
=========================================================

QR содержит только:

    https://verify.ibrop.dev/v/TOKEN

TOKEN ничего не кодирует.

Frontend:
    1. считывает QR;
    2. достаёт TOKEN;
    3. отправляет TOKEN backend;
    4. backend отвечает Web / Plus.

=========================================================
*/


/*
=========================================================
CONFIG
=========================================================
*/

/*
Пока backend работает на том же origin.

В будущем можно поменять, например, на:

const VERIFY_API =
    "https://api.verify.ibrop.dev";

Если frontend и API находятся на одном сервере,
оставляем пустую строку.
*/

const VERIFY_API = "https://opportunities-connected-extremely-beginner.trycloudflare.com";


/*
=========================================================
ELEMENTS
=========================================================
*/

const navbar =
    document.querySelector(".navbar");

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );

const confirmButtons =
    document.querySelectorAll(
        ".confirm-button"
    );


/*
=========================================================
SCANNER ELEMENTS
=========================================================
*/

const openScannerButton =
    document.getElementById(
        "openScanner"
    );

const scannerModal =
    document.getElementById(
        "scannerModal"
    );

const scannerView =
    document.getElementById(
        "scannerView"
    );

const scannerCloseButtons =
    document.querySelectorAll(
        "[data-close-scanner]"
    );

const video =
    document.getElementById(
        "qrVideo"
    );

const cameraStatus =
    document.getElementById(
        "cameraStatus"
    );

const scanResult =
    document.getElementById(
        "scanResult"
    );

const scanResultIcon =
    document.getElementById(
        "scanResultIcon"
    );

const scanResultKicker =
    document.getElementById(
        "scanResultKicker"
    );

const scanResultTitle =
    document.getElementById(
        "scanResultTitle"
    );

const scanResultMessage =
    document.getElementById(
        "scanResultMessage"
    );

const scanResultServer =
    document.getElementById(
        "scanResultServer"
    );

const scanResultSession =
    document.getElementById(
        "scanResultSession"
    );

const scanResultActions =
    document.getElementById(
        "scanResultActions"
    );

const scanAgain =
    document.getElementById(
        "scanAgain"
    );


/*
=========================================================
SCANNER STATE
=========================================================
*/

let cameraStream = null;

let barcodeDetector = null;

let scannerRunning = false;

let scannerBusy = false;

let scannerAnimationFrame = null;

let lastDetectedValue = null;


/*
=========================================================
NAVBAR
=========================================================
*/

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


/*
=========================================================
MOBILE MENU
=========================================================
*/

if (
    mobileMenuButton &&
    mobileMenu
) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList.toggle(
                    "open"
                );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    document
        .querySelectorAll(
            ".mobile-menu a"
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu
                            .classList
                            .remove(
                                "open"
                            );

                        mobileMenuButton
                            .setAttribute(
                                "aria-expanded",
                                "false"
                            );

                    }
                );

            }
        );

}


/*
=========================================================
ACTIVE SECTION
=========================================================
*/

function updateActiveSection() {

    let currentSection =
        "home";


    sections.forEach(
        (section) => {

            const sectionTop =
                section.offsetTop - 180;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navLinks.forEach(
        (link) => {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute(
                    "href"
                ) ===
                `#${currentSection}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


window.addEventListener(
    "scroll",
    updateActiveSection
);


updateActiveSection();


/*
=========================================================
PASS PREVIEW
=========================================================
*/

confirmButtons.forEach(
    (button) => {

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
                    2200
                );

            }
        );

    }
);


/*
=========================================================
CAMERA STATUS
=========================================================
*/

function setCameraStatus(
    message,
    type = ""
) {

    if (!cameraStatus) {
        return;
    }


    cameraStatus.textContent =
        message;


    cameraStatus.classList.remove(
        "success",
        "error"
    );


    if (type) {

        cameraStatus.classList.add(
            type
        );

    }

}


/*
=========================================================
OPEN SCANNER
=========================================================
*/

async function openScanner() {

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


    showScannerView();


    await startCamera();

}


/*
=========================================================
CLOSE SCANNER
=========================================================
*/

function closeScanner() {

    stopCamera();


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


/*
=========================================================
SHOW SCANNER VIEW
=========================================================
*/

function showScannerView() {

    if (scannerView) {
        scannerView.hidden = false;
    }


    if (scanResult) {

        scanResult.hidden =
            true;

        scanResult.classList.remove(
            "is-error"
        );

    }


    if (scanResultActions) {

        scanResultActions.innerHTML =
            "";

    }


    lastDetectedValue =
        null;


    setCameraStatus(
        "Запрашиваем доступ к камере…"
    );

}


/*
=========================================================
START CAMERA
=========================================================
*/

async function startCamera() {

    stopCamera();


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showError(
            "Браузер не поддерживает доступ к камере."
        );

        return;

    }


    if (
        !("BarcodeDetector" in window)
    ) {

        showError(
            "Этот браузер не поддерживает встроенное распознавание QR. Для первого теста открой Verify в актуальном Chrome или Edge."
        );

        return;

    }


    try {

        const formats =
            await BarcodeDetector
                .getSupportedFormats();


        if (
            !formats.includes(
                "qr_code"
            )
        ) {

            showError(
                "Браузер видит камеру, но не поддерживает распознавание QR-кодов."
            );

            return;

        }


        barcodeDetector =
            new BarcodeDetector({
                formats: [
                    "qr_code"
                ]
            });


        setCameraStatus(
            "Разрешите доступ к камере"
        );


        cameraStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        facingMode: {
                            ideal:
                                "environment"
                        },

                        width: {
                            ideal:
                                1280
                        },

                        height: {
                            ideal:
                                720
                        }

                    },

                    audio:
                        false

                });


        if (!video) {

            throw new Error(
                "VIDEO_NOT_FOUND"
            );

        }


        video.srcObject =
            cameraStream;


        await video.play();


        scannerRunning =
            true;


        scannerBusy =
            false;


        lastDetectedValue =
            null;


        setCameraStatus(
            "Наведите камеру на Verify QR"
        );


        scanFrame();

    }

    catch (error) {

        console.error(
            "Verify camera error:",
            error
        );


        if (
            error.name ===
            "NotAllowedError"
        ) {

            showError(
                "Доступ к камере запрещён. Разрешите Verify использовать камеру в настройках браузера."
            );

            return;

        }


        if (
            error.name ===
            "NotFoundError"
        ) {

            showError(
                "Камера не найдена."
            );

            return;

        }


        if (
            error.name ===
            "NotReadableError"
        ) {

            showError(
                "Камера уже используется другой программой."
            );

            return;

        }


        showError(
            "Не удалось запустить камеру."
        );

    }

}


/*
=========================================================
STOP CAMERA
=========================================================
*/

function stopCamera() {

    scannerRunning =
        false;


    scannerBusy =
        false;


    if (
        scannerAnimationFrame !==
        null
    ) {

        cancelAnimationFrame(
            scannerAnimationFrame
        );


        scannerAnimationFrame =
            null;

    }


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                (track) => {

                    track.stop();

                }
            );


        cameraStream =
            null;

    }


    if (video) {

        video.srcObject =
            null;

    }

}


/*
=========================================================
SCAN LOOP
=========================================================
*/

async function scanFrame() {

    if (!scannerRunning) {
        return;
    }


    if (
        !video ||
        video.readyState < 2
    ) {

        scannerAnimationFrame =
            requestAnimationFrame(
                scanFrame
            );

        return;

    }


    if (
        barcodeDetector &&
        !scannerBusy
    ) {

        scannerBusy =
            true;


        try {

            const codes =
                await barcodeDetector.detect(
                    video
                );


            if (
                codes.length > 0
            ) {

                const rawValue =
                    String(
                        codes[0].rawValue ||
                        ""
                    ).trim();


                if (
                    rawValue &&
                    rawValue !==
                    lastDetectedValue
                ) {

                    lastDetectedValue =
                        rawValue;


                    await handleQRCode(
                        rawValue
                    );

                }

            }

        }

        catch (error) {

            console.warn(
                "QR detection error:",
                error
            );

        }

        finally {

            scannerBusy =
                false;

        }

    }


    if (scannerRunning) {

        scannerAnimationFrame =
            requestAnimationFrame(
                scanFrame
            );

    }

}


/*
=========================================================
EXTRACT TOKEN

Допустимые ссылки:

https://verify.ibrop.dev/v/TOKEN

Для локального тестирования также:

http://localhost:5000/v/TOKEN
http://127.0.0.1:5000/v/TOKEN
=========================================================
*/

function extractVerifyToken(
    rawValue
) {

    let url;


    try {

        url =
            new URL(
                rawValue
            );

    }

    catch {

        return null;

    }


    const allowedHosts =
        new Set([

            "verify.ibrop.dev",

            "www.verify.ibrop.dev",

            "localhost",

            "127.0.0.1"

        ]);


    if (
        !allowedHosts.has(
            url.hostname
        )
    ) {

        return null;

    }


    const match =
        url.pathname.match(
            /^\/v\/([A-Za-z0-9_-]{20,200})\/?$/
        );


    if (!match) {
        return null;
    }


    return match[1];

}


/*
=========================================================
QR FOUND
=========================================================
*/

async function handleQRCode(
    rawValue
) {

    const token =
        extractVerifyToken(
            rawValue
        );


    if (!token) {

        setCameraStatus(
            "Это не Verify QR",
            "error"
        );


        setTimeout(
            () => {

                if (
                    scannerRunning
                ) {

                    setCameraStatus(
                        "Наведите камеру на Verify QR"
                    );

                }

            },
            1300
        );


        return;

    }


    setCameraStatus(
        "Verify QR найден",
        "success"
    );


    stopCamera();


    await resolveToken(
        token
    );

}


/*
=========================================================
RESOLVE TOKEN

Frontend отправляет только TOKEN.

Он НЕ пытается определить:
- Web;
- Plus;
- сервер;
- Discord пользователя.

Это делает backend.
=========================================================
*/

async function resolveToken(
    token
) {

    showLoadingResult();


    try {

        const response =
            await fetch(
                `${VERIFY_API}/api/verify/session/${encodeURIComponent(
                    token
                )}`,
                {

                    method:
                        "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache:
                        "no-store"

                }
            );


        let data;


        try {

            data =
                await response.json();

        }

        catch {

            throw new Error(
                "INVALID_SERVER_RESPONSE"
            );

        }


        if (!response.ok) {

            switch (
                data.error
            ) {

                case "SESSION_NOT_FOUND":

                    showError(
                        "Verify-сессия не найдена или уже истекла."
                    );

                    return;


                case "SESSION_EXPIRED":

                    showError(
                        "Время этой Verify-сессии закончилось."
                    );

                    return;


                case "SESSION_USED":

                    showError(
                        "Этот Verify QR уже был использован."
                    );

                    return;


                case "SESSION_CANCELLED":

                    showError(
                        "Эта Verify-сессия была отменена."
                    );

                    return;


                default:

                    showError(
                        "Verify Server не смог открыть эту сессию."
                    );

                    return;

            }

        }


        if (!data.ok) {

            showError(
                "Verify Server отклонил сессию."
            );

            return;

        }


        if (
            data.type !== "web" &&
            data.type !== "plus"
        ) {

            showError(
                "Verify Server вернул неизвестный тип проверки."
            );

            return;

        }


        showSuccess(
            token,
            data
        );

    }

    catch (error) {

        console.error(
            "Verify API error:",
            error
        );


        showError(
            "Не удалось связаться с Verify Server."
        );

    }

}


/*
=========================================================
LOADING RESULT
=========================================================
*/

function showLoadingResult() {

    if (scannerView) {
        scannerView.hidden = true;
    }


    if (!scanResult) {
        return;
    }


    scanResult.hidden =
        false;


    scanResult.classList.remove(
        "is-error"
    );


    if (scanResultIcon) {
        scanResultIcon.textContent =
            "…";
    }


    if (scanResultKicker) {
        scanResultKicker.textContent =
            "VERIFY SESSION";
    }


    if (scanResultTitle) {
        scanResultTitle.textContent =
            "Проверяем…";
    }


    if (scanResultMessage) {

        scanResultMessage.textContent =
            "Verify Server определяет тип сессии.";

    }


    if (scanResultServer) {
        scanResultServer.textContent =
            "—";
    }


    if (scanResultSession) {
        scanResultSession.textContent =
            "проверяем";
    }


    if (scanResultActions) {
        scanResultActions.innerHTML =
            "";
    }

}


/*
=========================================================
SUCCESS
=========================================================
*/

function showSuccess(
    token,
    data
) {

    if (scannerView) {
        scannerView.hidden = true;
    }


    if (!scanResult) {
        return;
    }


    scanResult.hidden =
        false;


    scanResult.classList.remove(
        "is-error"
    );


    const isPlus =
        data.type === "plus";


    if (scanResultIcon) {
        scanResultIcon.textContent =
            "✓";
    }


    if (scanResultKicker) {
        scanResultKicker.textContent =
            "QR РАСПОЗНАН";
    }


    if (scanResultTitle) {

        scanResultTitle.textContent =
            isPlus
                ? "VERIFY PLUS"
                : "VERIFY WEB";

    }


    if (scanResultMessage) {

        scanResultMessage.textContent =
            isPlus
                ? "Verify Plus готов. Продолжите проверку через Verify Pass или Helper."
                : "Verify Web готов. Проверку можно продолжить в браузере.";

    }


    if (scanResultServer) {

        scanResultServer.textContent =
            data.server ||
            "Discord Server";

    }


    if (scanResultSession) {

        scanResultSession.textContent =
            `активна · ${formatTime(
                data.expires_in
            )}`;

    }


    if (!scanResultActions) {
        return;
    }


    scanResultActions.innerHTML =
        "";


    if (!isPlus) {

        const webButton =
            document.createElement(
                "button"
            );


        webButton.type =
            "button";


        webButton.className =
            "result-primary";


        webButton.textContent =
            "Открыть Verify Web";


        webButton.addEventListener(
            "click",
            () => {

                /*
                Следующий этап проекта:
                настоящий Web flow.

                Пока оставляем переход
                на будущий адрес.
                */

                window.location.href =
                    `/web/${encodeURIComponent(
                        token
                    )}`;

            }
        );


        scanResultActions.appendChild(
            webButton
        );


        return;

    }


    const passButton =
        document.createElement(
            "button"
        );


    passButton.type =
        "button";


    passButton.className =
        "result-primary";


    passButton.textContent =
        "Открыть в Verify Pass";


    passButton.addEventListener(
        "click",
        () => {

            openVerifyPass(
                token
            );

        }
    );


    const helperButton =
        document.createElement(
            "button"
        );


    helperButton.type =
        "button";


    helperButton.className =
        "result-secondary";


    helperButton.textContent =
        "Продолжить через Helper";


    helperButton.addEventListener(
        "click",
        () => {

            window.location.href =
                `/helper/${encodeURIComponent(
                    token
                )}`;

        }
    );


    scanResultActions.append(
        passButton,
        helperButton
    );

}


/*
=========================================================
VERIFY PASS

Пока deep-link будущий.

Когда сделаем Pass,
он сможет зарегистрировать:

verify-pass://verify/TOKEN
=========================================================
*/

function openVerifyPass(
    token
) {

    const deepLink =
        `verify-pass://verify/${encodeURIComponent(
            token
        )}`;


    window.location.href =
        deepLink;

}


/*
=========================================================
ERROR
=========================================================
*/

function showError(
    message
) {

    stopCamera();


    if (scannerView) {
        scannerView.hidden = true;
    }


    if (!scanResult) {

        alert(message);

        return;

    }


    scanResult.hidden =
        false;


    scanResult.classList.add(
        "is-error"
    );


    if (scanResultIcon) {
        scanResultIcon.textContent =
            "!";
    }


    if (scanResultKicker) {
        scanResultKicker.textContent =
            "VERIFY ERROR";
    }


    if (scanResultTitle) {
        scanResultTitle.textContent =
            "Что-то пошло не так";
    }


    if (scanResultMessage) {
        scanResultMessage.textContent =
            message;
    }


    if (scanResultServer) {
        scanResultServer.textContent =
            "—";
    }


    if (scanResultSession) {
        scanResultSession.textContent =
            "ошибка";
    }


    if (scanResultActions) {

        scanResultActions.innerHTML =
            "";


        const retry =
            document.createElement(
                "button"
            );


        retry.type =
            "button";


        retry.className =
            "result-primary";


        retry.textContent =
            "Попробовать снова";


        retry.addEventListener(
            "click",
            restartScanner
        );


        const gojo =
            document.createElement(
                "div"
            );


        gojo.className =
            "gojo-message";


        gojo.innerHTML =
            getGojoMessage();


        scanResultActions.append(
            retry,
            gojo
        );

    }

}


/*
=========================================================
GOJO EASTER EGG
=========================================================
*/

function getGojoMessage() {

    const now =
        new Date();


    const currentMinutes =
        (
            now.getHours() *
            60
        ) +
        now.getMinutes();


    const gojoArrival =
        (20 * 60) + 31;


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
            20:31. Годжо Сатору прибыл.
        </strong>

        <br>

        Но даже он пока не смог открыть эту сессию.
    `;

}


/*
=========================================================
RESTART SCANNER
=========================================================
*/

async function restartScanner() {

    showScannerView();


    await startCamera();

}


/*
=========================================================
TIME
=========================================================
*/

function formatTime(
    seconds
) {

    const value =
        Math.max(
            0,
            Math.floor(
                Number(seconds) || 0
            )
        );


    const minutes =
        Math.floor(
            value / 60
        );


    const remainingSeconds =
        value % 60;


    return (
        String(minutes)
            .padStart(
                2,
                "0"
            )
        +
        ":"
        +
        String(remainingSeconds)
            .padStart(
                2,
                "0"
            )
    );

}


/*
=========================================================
DIRECT VERIFY LINK

GitHub Pages не умеет сам обслуживать
динамический /v/TOKEN.

Поэтому production-маршрут позже
сделаем через backend / Worker.

Но frontend уже умеет принимать:

#verify=TOKEN
=========================================================
*/

async function handleVerifyHash() {

    const hash =
        window.location.hash;


    if (
        !hash.startsWith(
            "#verify="
        )
    ) {

        return;

    }


    const token =
        hash.slice(
            "#verify=".length
        );


    if (
        !/^[A-Za-z0-9_-]{20,200}$/.test(
            token
        )
    ) {

        return;

    }


    history.replaceState(
        null,
        "",
        window.location.pathname
    );


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


    stopCamera();


    await resolveToken(
        token
    );

}


/*
=========================================================
EVENTS
=========================================================
*/

if (openScannerButton) {

    openScannerButton.addEventListener(
        "click",
        openScanner
    );

}


scannerCloseButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            closeScanner
        );

    }
);


if (scanAgain) {

    scanAgain.addEventListener(
        "click",
        restartScanner
    );

}


/*
=========================================================
ESC
=========================================================
*/

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


/*
=========================================================
RESIZE
=========================================================
*/

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


/*
=========================================================
START
=========================================================
*/

window.addEventListener(
    "DOMContentLoaded",
    handleVerifyHash
);
