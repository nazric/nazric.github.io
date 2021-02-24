// Global Variables
var canvas;
var ctx;
var ball;
var i_step = 0;
var elasticity = .99;

// Constants
const FrameWidth = 1280;
const FrameHeight = 720;
const FrameRate = 120;  // fps
const Background = "#ffe7c9"
const Gravity = -1800;
const HorzCap = 10000;
const VertCap = 10000;

// Initial conditions
var elasticity = .99;

function main() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);

    reset();
    window.setInterval(step, 1000 * (1/FrameRate));
}

function reset() {
    actors = [];
    ball1 = {x: 640, y: 50, 'vx':1500, 'vy':0, 'ax':0, 'ay':0, rx: 40, ry: 40, shape:'circle', fillStyle: "red"};
    ball2 = {x: 400, y: 50, 'vx':-1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "blue"};
    ball3 = {x: 640, y: 200, 'vx':-1500, 'vy':1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "purple"};
    ball4 = {x: 100, y: 700, 'vx':-1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "green"};
    ball5 = {x: 1000, y: 50, 'vx':1500, 'vy':0, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "yellow"};
    ball6 = {x: 700, y: 400, 'vx':1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "pink"};
    ball7 = {x: 1200, y: 50, 'vx':1500, 'vy':0, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "orange"};
    ball8 = {x: 600, y: 600, 'vx':-1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, shape:'circle', fillStyle: "teal"};
    actors.push(ball1);
    actors.push(ball2);
    actors.push(ball3);
    actors.push(ball4);
    actors.push(ball5);
    actors.push(ball6);
    actors.push(ball7);
    actors.push(ball8);
    step();
}

function step() {
    drawBackground();
    wallCollission(actors);
    objectCollisions(actors);
    updateKin(actors);
    renderObjects(actors);
    i_step++;
}

function keyDown(event) {
    var key = event.keyCode;
    // alert(key);
    // left
    if (key == 65 || key == 37) {
        ball1.ax = -5000;
        if (-ball1.vx >= HorzCap) {
            ball1.vx = - HorzCap;
        }
    }
    // right
    else if(key == 68 || key == 39) {
        ball1.ax = 5000;
        if (ball1.vx >= HorzCap) {
            ball1.vx = HorzCap
        }
    }
    // up
    else if(key == 87 || key == 38) {
        ball1.ay = 5000;
        if (ball1.vy >= VertCap) {
            ball1.vy = VertCap
        }
    }
    // down
    else if(key == 83 || key == 40) {
        ball1.ay = -5000;
        if (ball1.vy >= VertCap) {
            ball1.vy = - VertCap
        }
    }
}

function keyUp(event) {
    var key = event.keyCode;
    // left
    if (key == 65 || key == 37) {
        ball1.ax = 0;
    }
    // right
    else if(key == 68 || key == 39) {
        ball1.ax = 0;
    }
    // up
    else if(key == 87 || key == 38) {
        ball1.ay = 0;
    }
    // down
    else if(key == 83 || key == 40) {
        ball1.ay = 0;
    }
}

function drawBackground() {
    ctx.fillStyle = Background;
    ctx.fillRect(0, 0, FrameWidth, FrameHeight);
}

function wallCollission(objects) {
    objects.forEach(function(value, index, array) {
        if(value.y + value.ry >= FrameHeight) {
            value.y = FrameHeight - value.ry;
            value.vy *= -elasticity;
        }
        else if(value.y - value.ry <= 0) {
            value.y = value.rx;
            value.vy *= -elasticity;
        }
        if(value.x + value.rx >= FrameWidth){
            value.x = FrameWidth - value.rx;
            value.vx *= -elasticity;
        } 
        else if (value.x - value.rx <= 0) {
            value.x = value.rx;
            value.vx *= -elasticity;
        }
    });
}

function objectCollisions(objects) {
    objects.forEach(function (value1, index1, array) {
        for(var index2 = index1 + 1; index2 < array.length; index2++) {
            var value2 = array[index2];
            // Circle
            // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
            var dx = value1.x - value2.x;
            var dy = value1.y - value2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < value1.rx + value2.rx) {
                var energy1 = elasticity * (Math.abs(value1.vx) + Math.abs(value1.vy));
                var energy2 = elasticity * (Math.abs(value2.vx) + Math.abs(value2.vy));
                var energySplit = (energy1 + energy2) / 2;
                energy1 = energySplit;
                energy2 = energySplit;
                // var energy2 = 0.5 * (value2.vx * value2.vx + value2.vy * value2.vy);
                var xprop = Math.abs(dx)/(Math.abs(dx) + Math.abs(dy));
                var xdir = Math.sign(dx);
                var ydir = Math.sign(dy)
                value1.vx = xdir * energy1 * xprop;
                value1.vy = - ydir * energy1 * (1 - xprop);
                value2.vx = - xdir * energy2 * xprop;
                value2.vy = ydir * energy2 * (1 - xprop);

                // value2.x = 
            }

            // rectangle
            // if (value1.x - value1.rx < value2.x + value2.rx &&
            //     value1.x + value1.rx > value2.x - value2.rx &&
            //     value1.y - value1.ry < value2.y + value2.ry &&
            //     value1.y + value1.ry > value2.y - value2.ry )
            // {
            //     // collision detected
            // }
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

function setElasticity(value) {
    elasticity = value;
}

window.onload = main;
