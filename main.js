const titlePage = document.getElementById("title-page");

titlePage.style.display = "none";

// DOM elements
const sun = document.getElementById("sun");
const vminPerAu = 90 / 60.1;
const planets = [
    {
        orbit:    document.getElementById("mercury-orbit"),
        planet:   document.getElementById("mercury"),
        distance: vminPerAu * 0.39,
        speed:    1 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("venus-orbit"),
        planet:   document.getElementById("venus"),
        distance: vminPerAu * 0.72,
        speed:    88 / 225 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("earth-orbit"),
        planet:   document.getElementById("earth"),
        distance: vminPerAu * 1.00,
        speed:    88 / 365.25 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("mars-orbit"),
        planet:   document.getElementById("mars"),
        distance: vminPerAu * 1.52,
        speed:    88 / 687 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("jupiter-orbit"),
        planet:   document.getElementById("jupiter"),
        distance: vminPerAu * 5.20,
        speed:    88 / 4333 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("saturn-orbit"),
        planet:   document.getElementById("saturn"),
        distance: vminPerAu * 9.68,
        speed:    88 / 10759 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("uranus-orbit"),
        planet:   document.getElementById("uranus"),
        distance: vminPerAu * 19.22,
        speed:    88 / 30688 * Math.PI,
        theta:    0
    },
    {
        orbit:    document.getElementById("neptune-orbit"),
        planet:   document.getElementById("neptune"),
        distance: vminPerAu * 30.05,
        speed:    88 / 60190 * Math.PI,
        theta:    0
    },
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

const startingTime = new Date();

let zoomIndex = 1;
let orbitId;

document.addEventListener("DOMContentLoaded", () => {
    resize();

    for (let i = 0; i < 8; ++i) {
        const planet = planets[i];
        planet.planet.style.top  = "50%";
        planet.planet.style.left = `calc(50% + ${2 * planet.distance * zoomMagnitudes[zoomIndex] / 2}vmin)`;
    }
});

document.onkeydown = event => {
    switch (event.key) {
        case "f":
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen().catch(error => console.log(error));
            }
            break;
        case " ":
            if (event.shiftKey && !event.altKey) {
                zoomIndex = ++zoomIndex > 8 ? 8 : zoomIndex;
            }

            if (!event.shiftKey && event.altKey) {
                zoomIndex = --zoomIndex < 0 ? 0 : zoomIndex;
            }

            resize();
            break;
        case "p":
            if (orbitId === -1) {
                orbitId = requestAnimationFrame(updatePlanets);
            } else {
                cancelAnimationFrame(orbitId);
                orbitId = -1;
            }
            break;
    }
};

function resize() {
    sun.style.width  = `${vminPerAu * 0.0093 * zoomMagnitudes[zoomIndex]}vmin`;
    sun.style.height = `${vminPerAu * 0.0093 * zoomMagnitudes[zoomIndex]}vmin`;

    for (let i = 0; i < 8; ++i) {
        const planet = planets[i];
        const size = planet.distance * zoomMagnitudes[zoomIndex];

        if (size * min / 100 > 2 * max) {
            planet.orbit.style.display  = "none";
            planet.planet.style.display = "none";
        } else {
            planet.orbit.style.display  = "block";
            planet.planet.style.display = "block";
        }

        planet.orbit.style.width  = `${2 * planet.distance * zoomMagnitudes[zoomIndex]}vmin`;
        planet.orbit.style.height = `${2 * planet.distance * zoomMagnitudes[zoomIndex]}vmin`;
        planet.orbit.style.maskImage = `radial-gradient(transparent calc(${planet.distance * zoomMagnitudes[zoomIndex]}vmin - 2px), #000000 ${planet.distance * zoomMagnitudes[zoomIndex]}vmin)`;

        planet.planet.style.top  = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.sin(planet.theta)}vmin)`;
        planet.planet.style.left = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.cos(planet.theta)}vmin)`;
    }
}

function updatePlanets() {
    const now        = new Date();
    const timePassed = (startingTime - now) / 1000;

    for (let i = 0; i < 8; ++i) {
        const planet = planets[i];

        planet.theta = timePassed * planet.speed;

        planet.planet.style.top  = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.sin(planet.theta)}vmin)`;
        planet.planet.style.left = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.cos(planet.theta)}vmin)`;
    }

    requestAnimationFrame(updatePlanets);
}
