let c;
let ctx;
const img = new Image();

const floorselect = document.getElementById('floors');

window.onload = () => {
    c = document.getElementById('imageCanvas');
    c.width = window.innerWidth - 100;
    c.height = window.innerHeight - 10;
    ctx = c.getContext('2d');
    img.onload = () => {
        ctx.drawImage(img, 0, 0, img.width, img.height,
            0, 0, c.width, c.height);
        ctx.imageSmoothingEnabled = false;
    };
    img.src = 'assets/sample.jpeg';

    updatefloorImg();
};

function getCursorPosition(canvas, event) {
    // Consts
    const fullImgResX = 1580;
    const fullImgResY = 800;
    const AbsPixelsPerMeter = 1000 / 20; // Meters / Pixels, if image was 100% size TODO: CHANGE ME!

    // Find position in image in pixels
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find relative location (Position in pixels if image was 100% size)
    const relX = (x / canvas.width) * fullImgResX;
    const relY = (y / canvas.height) * fullImgResY;

    // Find actual location
    const actX = relX / AbsPixelsPerMeter;
    const actY = relY / AbsPixelsPerMeter;

    // Output
    const xinput = document.getElementById('inputX');
    const yinput = document.getElementById('inputY');

    xinput.value = Math.floor(actX * 100) / 100;
    yinput.value = Math.floor(actY * 100) / 100;
}
// eslint-disable-next-line no-unused-vars
function updatefloorImg() {
    console.log('hello');
    console.log(floorselect);
    img.src = `assets/${floorselect.value}.png`;
    console.log(img.src);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, c.width, c.height);
}

const canvas = document.getElementById('imageCanvas');
canvas.addEventListener('mousedown', (e) => {
    getCursorPosition(canvas, e);
});
