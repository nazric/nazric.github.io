var canvas;
var ctx;

i_step = 0;
function step() {
    ctx.fillStyle = 'red';
    ctx.fillRect(10 + i_step*10,10 + i_step*10,10,10);
    i_step++;
}

window.onload = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 1920, 1080);

    window.setInterval(step, 100);
};


