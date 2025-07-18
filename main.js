const titlePage = document.getElementById("title-page");

titlePage.style.display = "none";

// DOM elements
const sun = document.getElementById("sun");
const orbits = [
    document.getElementById("mercury-orbit"),
    document.getElementById("venus-orbit"),
    document.getElementById("earth-orbit"),
    document.getElementById("mars-orbit"),
    document.getElementById("jupiter-orbit"),
    document.getElementById("saturn-orbit"),
    document.getElementById("uranus-orbit"),
    document.getElementById("neptune-orbit")
];
const planets = [
    document.getElementById("mercury"),
    document.getElementById("venus"),
    document.getElementById("earth"),
    document.getElementById("mars"),
    document.getElementById("jupiter"),
    document.getElementById("saturn"),
    document.getElementById("uranus"),
    document.getElementById("neptune")
];

const vminPerAu = 90 / 30.05;
const vminPerOrbit = [
    vminPerAu * 0.39,
    vminPerAu * 0.72,
    vminPerAu * 1.00,
    vminPerAu * 1.52,
    vminPerAu * 5.20,
    vminPerAu * 9.68,
    vminPerAu * 19.22,
    vminPerAu * 30.05
];
const colors = [
    "red",
    'green',
    "blue",
    "orange",
    "green",
    "magenta",
    "white",
    "cyan"
];

const zoomMagnitudes = [
    0.75,
    1,
    1.625,
    3.25,
    6,
    20.5,
    31.25,
    43.75,
    80
];

const min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
const max = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;

let zoomIndex = 8;

document.addEventListener("DOMContentLoaded", () => {
    resize();

    for (let i = 0; i < 8; ++i) {
        planets[i].style.top  = "50vh";
        planets[i].style.left = `calc(50vw + ${vminPerOrbit[i] * zoomMagnitudes[zoomIndex]}vmin)`;
    }
});

document.onkeydown = event => {
    if (event.key === "f") {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(error => console.log(error));
        }
    }

    if (event.key === " " && event.shiftKey && !event.altKey) {
        if (++zoomIndex > 8) {
            zoomIndex = 8;
        }
        resize();
    }
    
    if (event.key === " " && !event.shiftKey && event.altKey) {
        if (--zoomIndex < 0) {
            zoomIndex = 0;
        }
        resize();
    }

};

function resize() {
    sun.style.width  = `${vminPerAu * 0.0093 * zoomMagnitudes[zoomIndex]}vmin`;
    sun.style.height = `${vminPerAu * 0.0093 * zoomMagnitudes[zoomIndex]}vmin`;

    for (let i = 0; i < 8; ++i) {
        const size = vminPerOrbit[i] * zoomMagnitudes[zoomIndex];

        if (size * min / 100 > 2 * max) {
            orbits[i].style.display = "none";
        } else {
            orbits[i].style.display = "block";
        }

        orbits[i].style.backgroundColor = colors[i];
        orbits[i].style.width  = `${vminPerOrbit[i] * zoomMagnitudes[zoomIndex]}vmin`;
        orbits[i].style.height = `${vminPerOrbit[i] * zoomMagnitudes[zoomIndex]}vmin`;
        orbits[i].style.maskImage = `radial-gradient(transparent calc(${vminPerOrbit[i] / 2 * zoomMagnitudes[zoomIndex]}vmin - 2px), #000000 ${vminPerOrbit[i] / 2 * zoomMagnitudes[zoomIndex]}vmin)`;
    }
}
