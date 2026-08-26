// Portfolio parallex animations JavaScript
let parallexObjects = {};

document.addEventListener('DOMContentLoaded', () => {
    InitializeParallexDOMElements();
    CalculateParallexThresholds();
    ScrollParallexAnimation();

    window.addEventListener('resize', (e) => {
        CalculateParallexThresholds();
    });

    window.addEventListener('scroll', (e) => {
        ScrollParallexAnimation();
    });
});

function InitializeParallexDOMElements() {
    parallexObjects.AboutText = {
        dom: document.querySelector("#about-text")
    }
    parallexObjects.CircuitBg = {
        dom: document.querySelector(".circuit-bg")
    }
}

function CalculateParallexThresholds() {
    if (Object.keys(parallexObjects).length === 0)
        return;

    const vh100 = window.innerHeight;
    const vh1 = vh100 / 100;
    const vh10 = vh1 * 10;
    const vh25 = vh1 * 25;
    const vh50 = vh1 * 50;
    const vh75 = vh1 * 75;

    parallexObjects.AboutText.threshold = GetParallexThreshold(parallexObjects.AboutText.dom, vh50, 1);
    parallexObjects.CircuitBg.threshold = GetParallexThreshold(parallexObjects.CircuitBg.dom, 0, 1);

    console.log(parallexObjects);
    ScrollParallexAnimation();
}

function GetParallexThreshold(selector, offset = 0, multiplier = 1) {
    return (GetDistanceFromViewportTop(selector) * multiplier) - offset;
}

function GetDistanceFromViewportTop(selector) {
    let elem;
    if (selector instanceof Element) {
        elem = selector
    }
    else {
        elem = document.querySelector(selector);
    }

    return elem.getBoundingClientRect().top + window.scrollY;
}

const aboutText = document.getElementById("about-text");
const circuitBg = document.querySelector(".circuit-bg");
function ScrollParallexAnimation() {
    const scrollY = window.scrollY;
    // console.log(scrollY);
    // aboutText.style.left = ParallexFunction(scrollY, 500, 0, 3) + "px";
    // circuitBg.style.scale = Math.max(1, 1.5 - ParallexFunction(scrollY, 1900, 0, -0.0008));

    let currElem;
    currElem = parallexObjects.AboutText;
    currElem.dom.style.translate = ParallexFunction(scrollY, currElem, 0, 3) + "px";
    currElem.dom.style.opacity = Math.max(0, 1 - ParallexFunction(scrollY, currElem, 0, -0.005));
    currElem = parallexObjects.CircuitBg;
    currElem.dom.style.scale = Math.max(1, 1.5 - ParallexFunction(scrollY, currElem, 0, -0.0008));
}

function ParallexFunction(scrollY, parallexObject, offset = 0, speed = 1) {
    let val = scrollY - offset;
    if (val > parallexObject.threshold) {
        return 0;
    }
    return (val - parallexObject.threshold) * speed;
}