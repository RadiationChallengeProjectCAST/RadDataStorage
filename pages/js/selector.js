window.onload = function () {
    var c = document.getElementById("imageCanvas");
    var ctx = c.getContext("2d");
    var img = new Image()
    img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height,     // source rectangle
                           0, 0, c.width, c.height)
    }
    img.src = "assets/sample.jpeg"
};

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    var xinput = document.getElementById("inputX")
    var yinput = document.getElementById("inputY")

    xinput.value = x;
    yinput.value = Math.floor(y);
    console.log("x: " + x + " y: " + y)
}

const canvas = document.getElementById('imageCanvas')
canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(canvas, e)
})