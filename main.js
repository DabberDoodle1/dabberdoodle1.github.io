const sun = document.getElementById("sun");

const vmin = document.innerWidth > document.innerHeight ? document.innerHeight : document.innerWidth;



const AU = 90 / 30.05 * VW;
const sunLength = 1391 / 149600 * VW;

console.log(sun);

window.onload = () => {
	document.documentElement.requestFullscreen().catch(err => {
		console.log(error);
	});
};