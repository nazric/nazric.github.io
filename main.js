var canvas;
var ctx;
var ball;
var i_step = 0;
const FrameWidth = 1280;
const FrameHeight = 720;
const FrameRate = 240;  // fps
const Elasticity = .9;
const Background = "#ffe7c9"

function main() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // ctx.fillStyle = 'green';
    // ctx.fillRect(0, 0, 1280, 720);

    // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    // ctx.fillStyle = 'blue';
    // ctx.fill();

    ball = {x: 640, y: 50, 'vx':1500, 'vy':0, 'ax':0, 'ay':-1000, rx: 10, ry: 10, shape:'circle', fillStyle: "red"};
    step();
    window.setInterval(step, 1000 * (1/FrameRate));
}

function step() {
    drawBackground();
    wallCollission([ball]);
    updateKin([ball]);
    renderObjects([ball]);
    i_step++;
}

function drawBackground() {
    ctx.fillStyle = Background;
    ctx.fillRect(0, 0, FrameWidth, FrameHeight);
}
function wallCollission(objects) {
    objects.forEach(function(value, index, array) {
        if(value.y + value.ry >= FrameHeight) {
            value.y = FrameHeight - value.ry;
            value.vy *= -Elasticity;
        }
        else if(value.y - value.ry <= 0) {
            value.y = value.rx;
            value.vy *= -Elasticity;
        }
        if(value.x + value.rx >= FrameWidth){
            value.x = FrameWidth - value.rx;
            value.vx *= -Elasticity;
        } 
        else if (value.x - value.rx <= 0) {
            value.x = value.rx;
            value.vx *= -Elasticity;
        }
    });
}

function updateKin(objects) {
    objects.forEach(function(value, index, array) {
        value.vx += value.ax / FrameRate;
        value.vy += value.ay / FrameRate;
        value.x += value.vx / FrameRate;
        value.y -= value.vy / FrameRate;
    });

}

function renderObjects(objects) {
    objects.forEach(function (value, index, array) {
        ctx.fillStyle = value.fillStyle;
        if(value.shape == 'circle') {
            ctx.beginPath();
            ctx.arc(value.x, value.y, value.rx, 0, 2 * Math.PI);
            ctx.fill();
        }
        else if(value.shape == 'rectangle') {
            ctx.fillRect(value.x - value.rx, value.y - value.ry, 2 * value.rx + 1, 2 * value.ry + 1);
            ctx.fill();
        }
    });
}

window.onload = main;
