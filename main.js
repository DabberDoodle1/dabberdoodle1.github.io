const userOnMobile = detectDevice();

const select         = document.getElementById("select");
const magnitudeLabel = document.getElementById("magnitudeLabel");

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

let touchStartY = 0;
let lastTouchTime = 0;

if (userOnMobile) {
	document.ontouchstart = event => {
		event.preventDefault();
		touchStartY   = event.touches[0].clientY;
	}

	document.ontouchend = event => {
		const touchDiffY = touchStartY - event.changedTouches[0].clientY;

		let currentTouchTime = new Date();
		
		if (currentTouchTime - lastTouchTime <= 200) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen().catch(error => console.log(error));
            }
		}
		
		lastTouchTime = currentTouchTime;

		if (Math.abs(touchDiffY) < window.innerHeight * 0.15) {
			return;
		}

		if (touchDiffY > 0) {
			zoomIndex = ++zoomIndex > 8 ? 8 : zoomIndex;
		} else {
			zoomIndex = --zoomIndex < 0 ? 0 : zoomIndex;
		}

		resize();
	}
	
	sizeIndex = 4;
	for (let i in celestialBodies) {
		celestialBodies[i].sizeAmp = i == 0 ? planetSizes[sizeIndex] / 100 : planetSizes[sizeIndex];
	}

	select.style.display = "none";
	magnitudeLabel.innerHTML = "sun multiplier: 20,000x<br/>size multiplier: 2,000,000x";
	
	resize();
} else {
	renameLabel();
}

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
            renameLabel();

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
            renameLabel();
            
            select.style.width  = `${celestialBodyResize.size * celestialBodyResize.sizeAmp * zoomMagnitudes[zoomIndex] * 1.2}vmin`;
            select.style.height = `${celestialBodyResize.size * celestialBodyResize.sizeAmp * zoomMagnitudes[zoomIndex] * 1.2}vmin`;
            break;
        case "Enter":
            document.body.style.backgroundColor = "#1899DD";
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

function renameLabel() {
    const celestialBody = celestialBodies[planetIndex];
    magnitudeLabel.textContent = `${celestialBody.planet.id} size multiplier:
    ${celestialBody.sizeAmp.toLocaleString()}x`;
}

orbitId = requestAnimationFrame(updatePlanets);

function detectDevice() {
    let isMobile = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetch|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) 
        isMobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile;
}