const titlePage = document.getElementById("title-page");
const select    = document.getElementById("select");

titlePage.style.display = "none";

select.style.top  = "50%";
select.style.left = "50%";

// DOM elements
const vminPerAu = 90 / 60.1;
const celestialBodies = [
    {
        orbit:    null,
        planet:   document.getElementById("sun"),
        distance: 0,
        size:     vminPerAu * 1391400 / 149597870700,
        sizeAmp:  1,
        speed:    0,
        theta:    0
    },
    {
        orbit:    document.getElementById("mercury-orbit"),
        planet:   document.getElementById("mercury"),
        distance: vminPerAu * 0.39,
        size:     vminPerAu * 4880 / 149597870700,
        sizeAmp:  1,
        speed:    1 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("venus-orbit"),
        planet:   document.getElementById("venus"),
        distance: vminPerAu * 0.72,
        size:     vminPerAu * 12104 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 225 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("earth-orbit"),
        planet:   document.getElementById("earth"),
        distance: vminPerAu * 1.00,
        size:     vminPerAu * 12756 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 365.25 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("mars-orbit"),
        planet:   document.getElementById("mars"),
        distance: vminPerAu * 1.52,
        size:     vminPerAu * 6792 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 687 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("jupiter-orbit"),
        planet:   document.getElementById("jupiter"),
        distance: vminPerAu * 5.20,
        size:     vminPerAu * 129884 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 4333 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("saturn-orbit"),
        planet:   document.getElementById("saturn"),
        distance: vminPerAu * 9.68,
        size:     vminPerAu * 120536 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 10759 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("uranus-orbit"),
        planet:   document.getElementById("uranus"),
        distance: vminPerAu * 19.22,
        size:     vminPerAu * 51118 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 30688 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("neptune-orbit"),
        planet:   document.getElementById("neptune"),
        distance: vminPerAu * 30.05,
        size:     vminPerAu * 49528 / 149597870700,
        sizeAmp:  1,
        speed:    88 / 60190 * Math.PI,
        theta:    Math.random() * 360
    }
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

const planetSizes = [
    1,
    100,
    1000,
    1000000,
    2000000
];

const min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
const max = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;

let zoomIndex   = 1;
let planetIndex = 0;
let sizeIndex   = 0;
let lastTime    = new Date();
let orbitId;

document.addEventListener("DOMContentLoaded", resize);

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
                lastTime = new Date();
                orbitId  = requestAnimationFrame(updatePlanets);
            } else {
                cancelAnimationFrame(orbitId);
                orbitId = -1;
            }
            break;
        case "ArrowRight":
        case "ArrowLeft":
            if (event.key === "ArrowRight") {
                ++planetIndex;
                if (planetIndex > 8) {
                    planetIndex = 8;
                }
            } else {
                --planetIndex;
                if (planetIndex < 0) {
                    planetIndex = 0;
                }
            }
            
            const celestialBodySelect = celestialBodies[planetIndex];

            select.style.width  = `${celestialBodySelect.size * celestialBodySelect.sizeAmp * zoomMagnitudes[zoomIndex] * 1.25}vmin`;
            select.style.height = `${celestialBodySelect.size * celestialBodySelect.sizeAmp * zoomMagnitudes[zoomIndex] * 1.25}vmin`;
            select.style.top    = `calc(50% + ${celestialBodySelect.distance * zoomMagnitudes[zoomIndex] * Math.sin(celestialBodySelect.theta)}vmin)`;
            select.style.left   = `calc(50% + ${celestialBodySelect.distance * zoomMagnitudes[zoomIndex] * Math.cos(celestialBodySelect.theta)}vmin)`;
            break;
        case "ArrowUp":
        case "ArrowDown":
            const celestialBodyResize = celestialBodies[planetIndex];
            
            for (let i = 0; i < 5; ++i) {
                const planetSize = planetIndex === 0 ? planetSizes[i] / 100 : planetSizes[i];
                
                if (planetSize === celestialBodyResize.sizeAmp) {
                    sizeIndex = i;
                    break;
                }
            }
            
            if (event.key === "ArrowUp") {
                ++sizeIndex;
                if (sizeIndex > 4) {
                    sizeIndex = 4;
                }
            } else {
                --sizeIndex;
                if (sizeIndex < 0) {
                    sizeIndex = 0;
                }
            }
            

            celestialBodyResize.sizeAmp = planetIndex === 0 ? planetSizes[sizeIndex] / 100 : planetSizes[sizeIndex];
            resizePlanet(celestialBodyResize);
            
            select.style.width  = `${celestialBodyResize.size * celestialBodyResize.sizeAmp * zoomMagnitudes[zoomIndex] * 1.2}vmin`;
            select.style.height = `${celestialBodyResize.size * celestialBodyResize.sizeAmp * zoomMagnitudes[zoomIndex] * 1.2}vmin`;
            break;
    }
};

function resize() {
    const zoom = zoomMagnitudes[zoomIndex];
    const sun  = celestialBodies[0];

    sun.planet.style.width  = `${sun.size * sun.sizeAmp * zoom}vmin`;
    sun.planet.style.height = `${sun.size * sun.sizeAmp * zoom}vmin`;
    
    if (planetIndex === 0) {
        select.style.width  = `${sun.size * sun.sizeAmp * zoom * 1.25}vmin`;
        select.style.height = `${sun.size * sun.sizeAmp * zoom * 1.25}vmin`;
    }

    for (let i = 1; i < 9; ++i) {
        const planet = celestialBodies[i];
        const size = planet.distance * zoom;

        if (size * min / 100 > 2 * max) {
            planet.orbit.style.display  = "none";
            planet.planet.style.display = "none";
        } else {
            planet.orbit.style.display  = "block";
            planet.planet.style.display = "block";
        }

        planet.orbit.style.width     = `${2 * size}vmin`;
        planet.orbit.style.height    = `${2 * size}vmin`;
        planet.orbit.style.maskImage = `radial-gradient(transparent calc(${size}vmin - 2px), #000000 ${size}vmin)`;

        planet.planet.style.width  = `${planet.size * planet.sizeAmp * zoom}vmin`;
        planet.planet.style.height = `${planet.size * planet.sizeAmp * zoom}vmin`;
        planet.planet.style.top    = `calc(50% + ${size * Math.sin(planet.theta)}vmin)`;
        planet.planet.style.left   = `calc(50% + ${size * Math.cos(planet.theta)}vmin)`;
        
        if (i === planetIndex) {
            select.style.top    = `calc(50% + ${size * Math.sin(planet.theta)}vmin)`;
            select.style.left   = `calc(50% + ${size * Math.cos(planet.theta)}vmin)`;
            select.style.width  = `${planet.size * planet.sizeAmp * zoom * 1.25}vmin`;
            select.style.height = `${planet.size * planet.sizeAmp * zoom * 1.25}vmin`;
        }
    }
}

function resizePlanet(planet) {
    planet.planet.style.width  = `${planet.size * planet.sizeAmp * zoomMagnitudes[zoomIndex]}vmin`;
    planet.planet.style.height = `${planet.size * planet.sizeAmp * zoomMagnitudes[zoomIndex]}vmin`;
}

function updatePlanets() {
    const now        = new Date();
    const timePassed = (lastTime - now) / 1000;
    
    lastTime = now;

    for (let i = 1; i < 9; ++i) {
        const planet = celestialBodies[i];

        planet.theta += timePassed * planet.speed;

        if (planet.theta > 360) {
            planet.theta %= 360;
        }

        planet.planet.style.top  = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.sin(planet.theta)}vmin)`;
        planet.planet.style.left = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.cos(planet.theta)}vmin)`;
        
        if (i === planetIndex) {
            select.style.top    = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.sin(planet.theta)}vmin)`;
            select.style.left   = `calc(50% + ${planet.distance * zoomMagnitudes[zoomIndex] * Math.cos(planet.theta)}vmin)`;
        }
        
        resizePlanet(planet);
    }

    orbitId = requestAnimationFrame(updatePlanets);
}

orbitId = requestAnimationFrame(updatePlanets);
