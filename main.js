const userOnMobile = detectDevice();

const solarSystem      = document.getElementById("solar-system");
const planetNavigation = document.getElementById("planet-navigation");
const toggle           = document.getElementById("toggle");

planetNavigation.style.display = "none";

const planetView       = document.getElementById("planet-view");
const planetImage      = document.getElementById("planet-image");
const line             = document.getElementById("line");
const description      = document.getElementById("description");
const descriptionText  = document.getElementById("description-text");
const descriptionTitle = document.getElementById("description-title");
const scan             = document.getElementById("scan");
const prev             = document.getElementById("prev");
const next             = document.getElementById("next");

for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
        const star = document.createElement("section");
        
        star.classList.add("planet");
        star.style.backgroundColor = "#FFFFFF";
        
        star.style.position = "absolute";
        star.style.top      = `${(i + Math.random()) * 12.5}%`;
        star.style.left     = `${(j + Math.random()) * 12.5}%`
        star.style.width    = "0.75vmin";
        star.style.height   = "0.75vmin";
        star.style.zIndex   = "-1";
        star.style.opacity  = "15%";
        
        solarSystem.appendChild(star);
    }
}

for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
        const star = document.createElement("section");
        
        star.classList.add("planet");
        star.style.backgroundColor = "#FFFFFF";
        
        star.style.position = "absolute";
        star.style.top = `${(i + Math.random()) * 12.5}%`;
        star.style.left = `${(j + Math.random()) * 12.5}%`
        star.style.width = "0.75vmin";
        star.style.height = "0.75vmin";
        star.style.zIndex = "-1";
        star.style.opacity = "15%";
        
        planetNavigation.appendChild(star);
    }
}

const magnitudeLabel = document.getElementById("magnitudeLabel");
magnitudeLabel.innerHTML = "sun size multiplier: 20,000x<br/>planet size multiplier: 2,000,000x";

// DOM elements
const vminPerAu = 90 / 60.1;
const celestialBodies = [
    {
        orbit:    null,
        planet:   document.getElementById("sun"),
        distance: 0,
        size:     vminPerAu * 1391400 / 149597870700,
        sizeAmp:  20000,
        speed:    0,
        theta:    0
    },
    {
        orbit:    document.getElementById("mercury-orbit"),
        planet:   document.getElementById("mercury"),
        distance: vminPerAu * 0.39,
        size:     vminPerAu * 4880 / 149597870700,
        sizeAmp:  2000000,
        speed:    1 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("venus-orbit"),
        planet:   document.getElementById("venus"),
        distance: vminPerAu * 0.72,
        size:     vminPerAu * 12104 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 225 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("earth-orbit"),
        planet:   document.getElementById("earth"),
        distance: vminPerAu * 1.00,
        size:     vminPerAu * 12756 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 365.25 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("mars-orbit"),
        planet:   document.getElementById("mars"),
        distance: vminPerAu * 1.52,
        size:     vminPerAu * 6792 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 687 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("jupiter-orbit"),
        planet:   document.getElementById("jupiter"),
        distance: vminPerAu * 5.20,
        size:     vminPerAu * 129884 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 4333 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("saturn-orbit"),
        planet:   document.getElementById("saturn"),
        distance: vminPerAu * 9.68,
        size:     vminPerAu * 120536 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 10759 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("uranus-orbit"),
        planet:   document.getElementById("uranus"),
        distance: vminPerAu * 19.22,
        size:     vminPerAu * 51118 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 30688 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("neptune-orbit"),
        planet:   document.getElementById("neptune"),
        distance: vminPerAu * 30.05,
        size:     vminPerAu * 49528 / 149597870700,
        sizeAmp:  2000000,
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

const min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
const max = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;

let zoomIndex  = 1;
let lastTime   = new Date();
let orbitId;
let onSolarSys = true;
let isScanning = false;
let progress   = 0;

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
		
		if (onSolarSys) {
		    if (Math.abs(touchDiffY) < window.innerHeight * 0.15) {
		        return;
		    }
		    
		    if (touchDiffY > 0) {
		        zoomIndex = ++zoomIndex > 8 ? 8 : zoomIndex;
    		} else {
    			zoomIndex = --zoomIndex < 0 ? 0 : zoomIndex;
    		}
		}

		resize();
	}
}

toggle.addEventListener("click", () => {
    if (onSolarSys) {
        toggle.style.backgroundImage = "url(\"res/planet_view.png\")";
        onSolarSys = false;
        
        planetNavigation.style.display = "block";
        solarSystem.style.display      = "none";
    } else {
        toggle.style.backgroundImage = "url(\"res/solar_system.png\")";
        onSolarSys = true;
        
        planetNavigation.style.display = "none";
        solarSystem.style.display = "block";
    }
});

scan.addEventListener("click", () => {
    if (!isScanning) {
        let lastScan = new Date();
        isScanning   = true;
        
        planetImage.style.animationPlayState = "paused";

        const scanAnimation = () => {
            const now   = new Date();
            const delta = now - lastScan;
            const gamma = progress > 1750
                ? (progress - 1750 > 875
                    ? 1 - (progress - 1750) / 1750
                    : (progress - 1750) / 1750)
                : (progress > 875
                    ? 1 - progress / 1750
                    : progress / 1750) ;

            lastScan  = now;
            progress += delta * (0.75 + gamma);

            if (progress > 3500) {
                progress   = 0;
                isScanning = false;
                
                line.style.top       = "0%";
                line.style.translate = "0 -100%";

                planetImage.style.animationPlayState = "running";

                return;
            }
            
            if (progress > 1750) {
                line.style.top       = `${100 - (progress - 1750) / 17.5}%`;
                line.style.translate = `0 ${-(progress - 1750) / 17.5}%`;
            } else {
                line.style.top       = `${progress / 17.5}%`;
                line.style.translate = `0 ${progress / 17.5 - 100}%`;
            }

            requestAnimationFrame(scanAnimation);
        };

        requestAnimationFrame(scanAnimation);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    resize();
    reload();
});

window.onresize = reload;

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
            if (onSolarSys) {
                if (event.shiftKey && !event.altKey) {
                    zoomIndex = ++zoomIndex > 8 ? 8 : zoomIndex;
                }
                
                if (!event.shiftKey && event.altKey) {
                    zoomIndex = --zoomIndex < 0 ? 0 : zoomIndex;
                }
                
                resize();
            }
            break;
        case "p":
            if (onSolarSys) {
                if (orbitId === -1) {
                    lastTime = new Date();
                    orbitId  = requestAnimationFrame(updatePlanets);
                } else {
                    cancelAnimationFrame(orbitId);
                    orbitId = -1;
                }
            }
            break;
    }
};

function reload() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const aspectRatio = isPortrait ? window.innerHeight / window.innerWidth : window.innerWidth / window.innerHeight;
    
    if (aspectRatio > 1.2) {
        const extra = (aspectRatio - 1.2) * 10;
        const dimensions = 40 + (extra > 20 ? 20 : extra);
        
        if (isPortrait) {
            planetView.style.width = `${dimensions}vmin`;
            planetView.style.height = `${dimensions}vmin`;
            
            description.style.width = `${dimensions * 1.60}vmin`;
            description.style.height = `${dimensions}vmin`;
            
            scan.style.width = `${dimensions * 1.20}vmin`;
            scan.style.height = `${dimensions * 0.3125}vmin`;
            
            descriptionText.style.fontSize = `${dimensions * 0.075}vmin`;
            descriptionText.style.paddingLeft = `${dimensions * 0.125}vmin`;
            descriptionText.style.paddingRight = `${dimensions * 0.0625}vmin`;
            descriptionText.style.paddingTop = `${dimensions * 0.0375}vmin`;
            descriptionText.style.paddingBottom = `${dimensions * 0.0375}vmin`;
            descriptionText.style.lineHeight = `${dimensions * 0.125}vmin`;
            
            descriptionTitle.style.fontSize = `${dimensions * 0.15}vmin`;
            descriptionTitle.style.paddingLeft = `${dimensions * 0.0625}vmin`;
            descriptionTitle.style.paddingTop = `${dimensions * 0.0375}vmin`;
            
            planetView.style.left = "50%";
            planetView.style.top  = `calc(50% - ${dimensions / 2 + 10}vmin)`;
            
            description.style.translate    = "-50% 50%";
            description.style.left         = "50%";
            description.style.bottom       = `calc(50% - ${dimensions * 0.3125 + 10}vmin)`;
            
            scan.style.translate = "-50% 50%";
            scan.style.left      = "50%";
            scan.style.bottom    = `calc(50% - ${dimensions * 0.96875 + 17.5}vmin)`;
            scan.style.fontSize  = `${dimensions * 0.3125 * 0.75}vmin`;
        } else {
            planetView.style.width = `${dimensions * 1.25}vmin`;
            planetView.style.height = `${dimensions * 1.25}vmin`;
            
            description.style.width = `${dimensions * 1.6}vmin`;
            description.style.height = `${dimensions * 0.78125}vmin`;
            
            scan.style.width = `${dimensions}vmin`;
            scan.style.height = `${dimensions * 0.2}vmin`;
            
            descriptionText.style.fontSize = `${dimensions * 0.78125 * 0.07}vmin`;
            descriptionText.style.paddingLeft = `${dimensions * 0.125}vmin`;
            descriptionText.style.paddingRight = `${dimensions * 0.0625}vmin`;
            descriptionText.style.paddingTop = `${dimensions * 0.0375}vmin`;
            descriptionText.style.paddingBottom = `${dimensions * 0.0375}vmin`;
            descriptionText.style.lineHeight = `${dimensions * 0.78125 * 0.105}vmin`;
            
            descriptionTitle.style.fontSize = `${dimensions * 0.15}vmin`;
            descriptionTitle.style.paddingLeft = `${dimensions * 0.0625}vmin`;
            descriptionTitle.style.paddingTop = `${dimensions * 0.0375}vmin`;
            
            planetView.style.top  = "50%";
            planetView.style.left = `calc(50% - ${dimensions / 2 + 10}vmin)`;
            
            description.style.translate = "50% -50%";
            description.style.top       = `calc(50% - ${dimensions * 0.125}vmin)`;
            description.style.right     = `calc(50% - ${dimensions * 0.8 + 10}vmin)`;
            
            scan.style.translate = "50% 50%";
            scan.style.bottom    = `calc(50% - ${dimensions * 0.46875}vmin)`;
            scan.style.right     = `calc(50% - ${dimensions * 0.8 + 10}vmin)`;
            scan.style.fontSize  = `calc(${dimensions * 0.2 * 0.75}vmin)`;
        }
    } else {
        planetView.style.width = "40vmin";
        planetView.style.height = "40vmin";
        
        if (isPortrait) {
            
        } else {
            
        }
    }
}

function resize() {
    const zoom = zoomMagnitudes[zoomIndex];
    const sun  = celestialBodies[0];

    sun.planet.style.width  = `${sun.size * sun.sizeAmp * zoom}vmin`;
    sun.planet.style.height = `${sun.size * sun.sizeAmp * zoom}vmin`;
    
    for (let i = 1; i < 9; ++i) {
const userOnMobile = detectDevice();

const titlePage = document.getElementById("title-page");
const blinking  = document.getElementById("blinking");

const solarSystem      = document.getElementById("solar-system");
const slideOverlap     = document.getElementById("slide-overlap");
const planetNavigation = document.getElementById("planet-navigation");
const toggle           = document.getElementById("toggle");

slideOverlap.style.display = "none";
planetNavigation.style.display = "none";

const slideImage = document.getElementById("slide-image");

slideImage.style.opacity = "0";

const planetView       = document.getElementById("planet-view");
const planetImage      = document.getElementById("planet-image");
const planetGlow       = document.getElementById("planet-glow");
const line             = document.getElementById("line");
const description      = document.getElementById("description");
const descriptionText  = document.getElementById("description-text");
const descriptionTitle = document.getElementById("description-title");
const scan             = document.getElementById("scan");
const prev             = document.getElementById("prev");
const next             = document.getElementById("next");

for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
        const star = document.createElement("section");
        
        star.classList.add("planet");
        star.style.backgroundColor = "#FFFFFF";
        
        star.style.position = "absolute";
        star.style.top      = `${(i + Math.random()) * 12.5}%`;
        star.style.left     = `${(j + Math.random()) * 12.5}%`
        star.style.width    = "0.75vmin";
        star.style.height   = "0.75vmin";
        star.style.zIndex   = "-1";
        star.style.opacity  = "15%";
        
        solarSystem.appendChild(star);
    }
}

for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
        const star = document.createElement("section");
        
        star.classList.add("planet");
        star.style.backgroundColor = "#FFFFFF";
        
        star.style.position = "absolute";
        star.style.top = `${(i + Math.random()) * 12.5}%`;
        star.style.left = `${(j + Math.random()) * 12.5}%`
        star.style.width = "0.75vmin";
        star.style.height = "0.75vmin";
        star.style.zIndex = "-1";
        star.style.opacity = "15%";
        
        planetNavigation.appendChild(star);
    }
}

const magnitudeLabel = document.getElementById("magnitudeLabel");
magnitudeLabel.innerHTML = "sun size multiplier: 20,000x<br/>planet size multiplier: 2,000,000x";

// DOM elements
const vminPerAu = 90 / 60.1;
const celestialBodies = [
    {
        orbit:    null,
        planet:   document.getElementById("sun"),
        distance: 0,
        size:     vminPerAu * 1391400 / 149597870700,
        sizeAmp:  20000,
        speed:    0,
        theta:    0
    },
    {
        orbit:    document.getElementById("mercury-orbit"),
        planet:   document.getElementById("mercury"),
        distance: vminPerAu * 0.39,
        size:     vminPerAu * 4880 / 149597870700,
        sizeAmp:  2000000,
        speed:    1 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("venus-orbit"),
        planet:   document.getElementById("venus"),
        distance: vminPerAu * 0.72,
        size:     vminPerAu * 12104 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 225 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("earth-orbit"),
        planet:   document.getElementById("earth"),
        distance: vminPerAu * 1.00,
        size:     vminPerAu * 12756 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 365.25 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("mars-orbit"),
        planet:   document.getElementById("mars"),
        distance: vminPerAu * 1.52,
        size:     vminPerAu * 6792 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 687 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("jupiter-orbit"),
        planet:   document.getElementById("jupiter"),
        distance: vminPerAu * 5.20,
        size:     vminPerAu * 129884 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 4333 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("saturn-orbit"),
        planet:   document.getElementById("saturn"),
        distance: vminPerAu * 9.68,
        size:     vminPerAu * 120536 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 10759 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("uranus-orbit"),
        planet:   document.getElementById("uranus"),
        distance: vminPerAu * 19.22,
        size:     vminPerAu * 51118 / 149597870700,
        sizeAmp:  2000000,
        speed:    88 / 30688 * Math.PI,
        theta:    Math.random() * 360
    },
    {
        orbit:    document.getElementById("neptune-orbit"),
        planet:   document.getElementById("neptune"),
        distance: vminPerAu * 30.05,
        size:     vminPerAu * 49528 / 149597870700,
        sizeAmp:  2000000,
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

const slideUrls = [
    "res/slideshow/9yr_old.jpg",
    "res/slideshow/Hacking.jpg",
    "res/slideshow/Family.jpg",
    "res/slideshow/Friends.png",
    "res/slideshow/Schools.jpg",
    "res/slideshow/Lost_dreams.jpg",
    "res/slideshow/Japanese_is_hard.jpg",
    "res/slideshow/Google.png"
];

const peers = [
    "res/slideshow/Denver.png",
    "res/slideshow/Matthew.png",
    "res/slideshow/Vince.png",
];

const descUrls   = [
    "res/earth.png",
    "res/mars.png",
    "res/mercury.png",
    "res/jupiter.png",
    "res/saturn.png",
    "res/venus.png",
    "res/uranus.png",
    "res/neptune.png",
];

const descTitles = [
    "Earth",
    "Mars",
    "Mercury",
    "Jupiter",
    "Saturn",
    "Venus",
    "Uranus",
    "Neptune"
];

const descDescs  = [
    "\"Here on Earth lies a photo of myself that I like because it's funny.\"",
    "\"Here on Mars lies the records of my skills and talents.\"",
    "\"Here on Mercury lies a diagram of what my family tree looks like.\"",
    "\"Here on Jupiter lies a picture of my peers.\"",
    "\"Here on Saturn lies whatever this is supposed to be.\"",
    "\"Here on Venus lies a time when I used to be happy.\"",
    "\"Here on Uranus lies a struggle of mine.\"",
    "\"Here on Neptune lies some random google quo—I mean a lifelong quote I definitely find meaningful.\""
];

const min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
const max = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;

let titleProgress   = 0;
let titleInProgress = false;
let blinkingPhase   = false;
let titleBlinkingId;

let slideProgress = 0;

let zoomIndex  = 1;
let lastTime   = new Date();
let orbitId;
let onSolarSys = true;

let isScanning = false;
let progress   = 0;

let descCurrentIndex = 0;

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
		
		if (onSolarSys) {
		    if (Math.abs(touchDiffY) < window.innerHeight * 0.15) {
		        return;
		    }
		    
		    if (touchDiffY > 0) {
		        zoomIndex = ++zoomIndex > 8 ? 8 : zoomIndex;
    		} else {
    			zoomIndex = --zoomIndex < 0 ? 0 : zoomIndex;
    		}
		}

		resize();
	}
}

titleBlinkingId = setInterval(() => {
    if (blinkingPhase) {
        blinking.textContent = "< Press anywhere to start >";
        blinkingPhase = false;
    } else {
        blinking.textContent = "Press anywhere to start";
        blinkingPhase = true;
    }
}, 875);

titlePage.addEventListener("click", () => {
    clearInterval(titleBlinkingId);
    
    if (!titleInProgress) {
        titleInProgress = true;
        let titleLast   = new Date();
        
        const titleAnimation = () => {
            const titleNow = new Date();
            const delta    = titleNow - titleLast;
            
            titleLast      = titleNow;
            titleProgress += delta;
            
            if (titleProgress > 1250) {
                titlePage.style.opacity = "0%";
                titlePage.style.backdropFilter = "blur(0px)";
                titlePage.style.display = "none";
                return;
            }
            
            titlePage.style.backdropFilter = `blur(${(1250 - titleProgress) / 125}px)`;
            titlePage.style.opacity = `${(1250 - titleProgress) / 12.5}%`;
            
            requestAnimationFrame(titleAnimation);
        }
        
        requestAnimationFrame(titleAnimation);
    }
});

toggle.addEventListener("click", () => {
    if (onSolarSys) {
        toggle.style.backgroundImage = "url(\"res/planet_view.png\")";
        onSolarSys = false;
        
        planetNavigation.style.display = "block";
        solarSystem.style.display      = "none";
    } else {
        toggle.style.backgroundImage = "url(\"res/solar_system.png\")";
        onSolarSys = true;
        
        planetNavigation.style.display = "none";
        solarSystem.style.display = "block";
    }
});

slideOverlap.addEventListener("click", () => {
    slideOverlap.style.opacity = "0";
    slideOverlap.style.display = "none";
});

let slideImageProgress = 0;
let slideImageIndex    = 0;

let slideImageOld = new Date();

scan.addEventListener("click", () => {
    if (!isScanning) {
        slideImage.style.backgroundImage = `url("${slideUrls[descCurrentIndex]}")`;
        slideImage.style.backgroundSize  = "contain";
        slideImage.style.backgroundPosition = "center";
        slideImage.style.backgroundRepeat = "no-repeat";
        
        let lastScan = new Date();
        isScanning   = true;
        
        const slideOpaque = () => {
            const now   = new Date();
            const delta = now - lastScan;
            
            lastScan = now;
            slideProgress += delta;
            
            if (slideProgress < 501) {
                slideOverlap.style.opacity = `${slideProgress / 500}`;
            } else if (slideProgress < 1001) {
                slideOverlap.style.opacity = "1";
                slideImage.style.opacity   = `${(slideProgress - 500) / 500}`;
            } else {
                slideImage.style.opacity = "1";
                
                slideProgress = 0;
                return;
            }
            
            requestAnimationFrame(slideOpaque);
        };
        
        const scanAnimation = () => {
            const now   = new Date();
            const delta = now - lastScan;
            const gamma = progress > 1750
                ? (progress - 1750 > 875
                    ? 1 - (progress - 1750) / 1750
                    : (progress - 1750) / 1750)
                : (progress > 875
                    ? 1 - progress / 1750
                    : progress / 1750) ;

            lastScan  = now;
            progress += delta * (0.75 + gamma);

            if (progress > 3000) {
                progress   = 0;
                isScanning = false;
                
                line.style.top       = "0%";
                line.style.translate = "0 -100%";
                
                slideOverlap.style.display = "block";
                slideOverlap.style.opacity = "0";
                requestAnimationFrame(slideOpaque);
                
                return;
            }
            
            if (progress < 251) {
                planetGlow.style.opacity = `${progress / 2.5 * 0.3}%`;
            } else if (progress < 1501) {
                line.style.top = `${(progress - 250) / 12.5}%`;
                line.style.translate = `0 ${(progress - 250) / 12.5 - 100}%`; 
            } else if (progress < 2751) {
                line.style.top = `${100 - (progress - 1500) / 12.5}%`;
                line.style.translate = `0 ${-(progress - 1500) / 12.5}%`;
            } else {
                planetGlow.style.opacity = `${30 - (progress - 2750) / 2.5 * 0.3}%`;
                
                line.style.top       = "0%";
                line.style.translate = "0 -100%";
            }
            
            requestAnimationFrame(scanAnimation);
        };
        
        requestAnimationFrame(scanAnimation);
    }
});

prev.addEventListener("click", () => {
    if (isScanning) {
        return;
    }
    
    --descCurrentIndex;
    
    if (descCurrentIndex < 0) {
        descCurrentIndex = 0;
    }
    
    planetImage.style.background = `url(${descUrls[descCurrentIndex]})`;
    planetImage.style.backgroundSize = "contain";
    planetImage.style.backgroundPosition = "center";
    descriptionTitle.textContent = descTitles[descCurrentIndex];
    descriptionText.textContent  = descDescs[descCurrentIndex];
});

next.addEventListener("click", () => {
    if (isScanning) {
        return;
    }
    
    ++descCurrentIndex;
    
    if (descCurrentIndex > 7) {
        descCurrentIndex = 7;
    }
    
    planetImage.style.background = `url(${descUrls[descCurrentIndex]})`;
    planetImage.style.backgroundSize = "contain";
    planetImage.style.backgroundPosition = "center";
    descriptionTitle.textContent = descTitles[descCurrentIndex];
    descriptionText.textContent  = descDescs[descCurrentIndex];
});

document.addEventListener("DOMContentLoaded", () => {
    resize();
    reload();
});

window.onresize = reload;

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
            if (onSolarSys) {
                if (event.shiftKey && !event.altKey) {
                    zoomIndex = ++zoomIndex > 8 ? 8 : zoomIndex;
                }
                
                if (!event.shiftKey && event.altKey) {
                    zoomIndex = --zoomIndex < 0 ? 0 : zoomIndex;
                }
                
                resize();
            }
            break;
        case "p":
            if (onSolarSys) {
                if (orbitId === -1) {
                    lastTime = new Date();
                    orbitId  = requestAnimationFrame(updatePlanets);
                } else {
                    cancelAnimationFrame(orbitId);
                    orbitId = -1;
                }
            }
            break;
    }
};

function reload() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const aspectRatio = isPortrait ? window.innerHeight / window.innerWidth : window.innerWidth / window.innerHeight;
    
    const extra = (aspectRatio - 1.2) * 10;
    const dimensions = 40 + (extra > 20 ? 20 : extra);
    
    if (isPortrait) {
        planetView.style.width = `${dimensions * 1.25}vmin`;
        planetView.style.height = `${dimensions * 1.25}vmin`;
        
        description.style.width = `${dimensions * 1.60}vmin`;
        description.style.height = `${dimensions}vmin`;
        
        scan.style.width = `${dimensions * 1.20}vmin`;
        scan.style.height = `${dimensions * 0.3125}vmin`;
        
        descriptionText.style.fontSize = `${dimensions * 0.1}vmin`;
        descriptionText.style.paddingLeft = `${dimensions * 0.125}vmin`;
        descriptionText.style.paddingRight = `${dimensions * 0.0625}vmin`;
        descriptionText.style.paddingTop = `${dimensions * 0.0375}vmin`;
        descriptionText.style.paddingBottom = `${dimensions * 0.0375}vmin`;
        descriptionText.style.lineHeight = `${dimensions * 0.175}vmin`;
        
        descriptionTitle.style.fontSize = `${dimensions * 0.15}vmin`;
        descriptionTitle.style.paddingLeft = `${dimensions * 0.0625}vmin`;
        descriptionTitle.style.paddingTop = `${dimensions * 0.0375}vmin`;
        
        planetView.style.left = "50%";
        planetView.style.top  = `calc(50% - ${dimensions / 2 + 10}vmin)`;
        
        prev.style.left = "10%";
        prev.style.top  = `calc(50% - ${dimensions / 2 + 10}vmin)`;
        prev.style.height = `${dimensions * 0.8}vmin`;
        prev.style.width  = `${dimensions * 0.1}vmin`;
        prev.style.translate  = "0 -50%";
        
        next.style.right = "10%";
        next.style.top   = `calc(50% - ${dimensions / 2 + 10}vmin)`;
        next.style.height = `${dimensions * 0.8}vmin`;
        next.style.width = `${dimensions * 0.1}vmin`;
        next.style.translate = "0 -50%";
        
        planetGlow.style.top  = "0";
        planetGlow.style.left = "0";
        planetGlow.style.opacity = "0%"
        
        description.style.translate    = "-50% 50%";
        description.style.left         = "50%";
        description.style.bottom       = `calc(50% - ${dimensions * 0.3125 + 10}vmin)`;
        
        scan.style.translate = "-50% 50%";
        scan.style.left      = "50%";
        scan.style.bottom    = `calc(50% - ${dimensions * 0.96875 + 17.5}vmin)`;
        scan.style.fontSize  = `${dimensions * 0.3125 * 0.75}vmin`;
    } else {
        planetView.style.width = `${dimensions * 1.25}vmin`;
        planetView.style.height = `${dimensions * 1.25}vmin`;
        
        description.style.width = `${dimensions * 1.6}vmin`;
        description.style.height = `${dimensions * 0.78125}vmin`;
        
        scan.style.width = `${dimensions}vmin`;
        scan.style.height = `${dimensions * 0.2}vmin`;
        
        descriptionText.style.fontSize = `${dimensions * 0.1}vmin`;
        descriptionText.style.paddingLeft = `${dimensions * 0.125}vmin`;
        descriptionText.style.paddingRight = `${dimensions * 0.0625}vmin`;
        descriptionText.style.paddingTop = `${dimensions * 0.0375}vmin`;
        descriptionText.style.paddingBottom = `${dimensions * 0.0375}vmin`;
        descriptionText.style.lineHeight = `${dimensions * 0.15}vmin`;
        
        descriptionTitle.style.fontSize = `${dimensions * 0.15}vmin`;
        descriptionTitle.style.paddingLeft = `${dimensions * 0.0625}vmin`;
        descriptionTitle.style.paddingTop = `${dimensions * 0.0375}vmin`;
        
        planetView.style.top  = "50%";
        planetView.style.left = `calc(50% - ${dimensions / 2 + 10}vmin)`;
        
        prev.style.top  = "50%";
        prev.style.left = "7.5%";
        prev.style.height = `${dimensions * 0.8}vmin`;
        prev.style.width  = `${dimensions * 0.15}vmin`;
        prev.style.translate  = "0 -50%";
        
        next.style.top   = "50%";
        next.style.right = "7.5%";
        next.style.height = `${dimensions * 0.8}vmin`;
        next.style.width  = `${dimensions * 0.15}vmin`;
        next.style.translate = "0 -50%"; 
        
        planetGlow.style.top  = "0";
        planetGlow.style.left = "0";
        planetGlow.style.opacity = "0%"
        
        description.style.translate = "50% -50%";
        description.style.top       = `calc(50% - ${dimensions * 0.125}vmin)`;
        description.style.right     = `calc(50% - ${dimensions * 0.8 + 10}vmin)`;
        
        scan.style.translate = "50% 50%";
        scan.style.bottom    = `calc(50% - ${dimensions * 0.46875}vmin)`;
        scan.style.right     = `calc(50% - ${dimensions * 0.8 + 10}vmin)`;
        scan.style.fontSize  = `calc(${dimensions * 0.2 * 0.75}vmin)`;
    }
}

function resize() {
    const zoom = zoomMagnitudes[zoomIndex];
    const sun  = celestialBodies[0];

    sun.planet.style.width  = `${sun.size * sun.sizeAmp * zoom}vmin`;
    sun.planet.style.height = `${sun.size * sun.sizeAmp * zoom}vmin`;
    
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
        
        resizePlanet(planet);
    }

    orbitId = requestAnimationFrame(updatePlanets);
}

orbitId = requestAnimationFrame(updatePlanets);

function slideOverlapFunction() {
    slideOverlap.style.opacity = "0";
    slideOverlap.style.display = "none";
}

function detectDevice() {
    let isMobile = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetch|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) 
        isMobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile;
	}
nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetch|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) 
        isMobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile;
}
