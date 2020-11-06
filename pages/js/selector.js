window.onload = function() {
    var c = document.getElementById("imageCanvas");
    console.log(c)
    var ctx = c.getContext("2d");
    console.log(ctx)
    var img = new Image()
    img.onload = function() {
        ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                            0, 0, c.width, c.height)
    }
    console.log(img)
    img.src = "assets/sample.jpeg"
    console.log(img)
};

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
}

const canvas = document.getElementById('imageCanvas')
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})