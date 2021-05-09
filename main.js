// Global Variables
var canvas;
var ctx;
var ball;
var i_step = 0;
var elasticity = .85;
var HorzCap = 700;
var VertCap = 700;

// Constants
const FrameWidth = 1280;
const FrameHeight = 720;
const FrameRate = 60;  // fps
const Background = "#ffe7c9";
const Net = "green";
const Gravity = -750;
const NetHeight = 300;
const NumNetPoly = 300;
const TopOfNet = {x: FrameWidth/2, y:FrameHeight - NetHeight, 'vx':0, 'vy':0, 'ax':0, 'ay':0, rx: 2, ry: 2, recoil: false, shape:'circle', fillStyle: Net}
const colourLoop = ["blue", ""];

// Initial conditions
var elasticity = .63;

function main() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);

    reset();
    window.setInterval(step, 1000.0 * (1.0/FrameRate));
}

function reset() {
    actors = [];
    actors.push();

    player1 = {x: 50, y: FrameHeight-40, newx: -1, newy: -1, 'vx':0, 'vy':0, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: false, isActor:true, shape:'circle', fillStyle: "#0ba2e3",
               upPress: false, downPress: false, rightPress: false, leftPress: false};
    player2 = {x: FrameWidth - 50, y: FrameHeight-40, newx: -1, newy: -1, 'vx':0, 'vy':0, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: false, isActor:true, shape:'circle', fillStyle: "purple",
               upPress: false, downPress: false, rightPress: false, leftPress: false};
    ball2 = {x: 400, y: 50, newx: -1, newy: -1, 'vx':700, 'vy':500, 'ax':0, 'ay':Gravity, rx: 20, ry: 20, recoil: true, shape:'circle', fillStyle: "blue"};
    actors.push(player1);
    actors.push(player2);
    actors.push(ball2);
    // ball3 = {x: 640, y: 200, 'vx':-1500, 'vy':1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: true, shape:'circle', fillStyle: "purple"};
    // ball4 = {x: 100, y: 700, 'vx':-1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: true, shape:'circle', fillStyle: "green"};
    // ball5 = {x: 1000, y: 50, 'vx':1500, 'vy':0, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: true, shape:'circle', fillStyle: "yellow"};
    // ball6 = {x: 700, y: 400, 'vx':1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: true, shape:'circle', fillStyle: "pink"};
    // ball7 = {x: 1200, y: 50, 'vx':1500, 'vy':0, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: true, shape:'circle', fillStyle: "orange"};
    // ball8 = {x: 600, y: 600, 'vx':-1500, 'vy':-1000, 'ax':0, 'ay':Gravity, rx: 40, ry: 40, recoil: true, shape:'circle', fillStyle: "teal"};

    // actors.push(ball3);
    // actors.push(ball4);
    // actors.push(ball5);
    // actors.push(ball6);
    // actors.push(ball7);
    // actors.push(ball8);
    step();
}

function setSpeedcap(newVal) {
    HorzCap = newVal;
    VertCap = newVal;
}

function step() {
    drawBackground();
    drawNet();

    handleKeys();
    wallCollission(actors);
    objectCollisions(actors);
    netCollision(actors);
    
    updateKin(actors);
    
    renderObjects(actors);
    // i_step++;
}

function handleKeys() {
    handlePlayerInput(player1);
    handlePlayerInput(player2);
}

function handlePlayerInput(playerObj) {
    // left
    if (playerObj.leftPress) {
        playerObj.ax = -5000;
        if(playerObj.vx > -100) {
            playerObj.vx = -100;
        }
    }
    // right
    else if(playerObj.rightPress) {
        playerObj.ax = 5000;
        if(playerObj.vx < 100) {
            playerObj.vx = 100;
        }
    }
    else {
        playerObj.ax = 0;
    }
    // up
    if(playerObj.upPress) {
        playerObj.ay = 5000;
        if(playerObj.vy < 100) {
            playerObj.vy = 100;
        }
    }
    // down
    else if(playerObj.downPress) {
        playerObj.ay = -5000 + Gravity;
        if(playerObj.vy > -100) {
            playerObj.vy = -100;
        }
    }
    else {
        playerObj.ay = Gravity;
    }
}

function keyDown(event) {
    var key = event.keyCode;
    switch(key) {
        case 65:
            player1.leftPress = true;
            break;
        case 37:
            player2.leftPress = true;
            break;
        case 68:
            player1.rightPress = true;
            break;
        case 39:
            player2.rightPress = true;
            break;
        case 87:
            player1.upPress = true;
            break;
        case 38:
            player2.upPress = true;
            break;
        case 83:
            player1.downPress = true;
            break;
        case 40:
            player2.downPress = true;
            break;
        case 82:
            reset();
    }
}

function keyUp(event) {
    var key = event.keyCode;
    switch(key) {
        case 65:
            player1.leftPress = false;
            break;
        case 37:
            player2.leftPress = false;
            break;
        case 68:
            player1.rightPress = false;
            break;
        case 39:
            player2.rightPress = false;
            break;
        case 87:
            player1.upPress = false;
            break;
        case 38:
            player2.upPress = false;
            break;
        case 83:
            player1.downPress = false;
            break;
        case 40:
            player2.downPress = false;
            break;
    }
}

function drawBackground() {
    ctx.fillStyle = Background;
    ctx.fillRect(0, 0, FrameWidth, FrameHeight);
}

function drawNet(){
    ctx.fillStyle = Net;
    ctx.fillRect(FrameWidth/2 - 2, FrameHeight - NetHeight, 4, NetHeight);
}

function collideNet(object) {
    if (object.x > FrameWidth / 2) {
        if (object.x - object.rx < FrameWidth / 2 + 2) {
            object.x = FrameWidth / 2 + 2 + object.rx;
            if (object.recoil)
                object.vx *= -elasticity;
            else 
                object.vx = 0;
        }
    }
    else {
        if(object.x + object.rx > FrameWidth / 2 - 2) {
            object.x = FrameWidth / 2 - 2 - object.rx;
            if (object.recoil)
                object.vx *= -elasticity;
            else 
                object.vx = 0;
        }
    }  
}

function netCollision(objects){
    objects.forEach(function(value, index, array) {
        if(!value.isActor && value.y + value.ry > FrameHeight - NetHeight && value.y < FrameHeight - NetHeight) {
            circleCollision(TopOfNet, value);
        }
        else if(value.isActor || value.y >= FrameHeight - NetHeight) {
            collideNet(value);
        }
    });
}   

function goal(rightScored) {
    // if(rightScored) {
    //     console.log("right scores!!!!!");
    // }
    // else{
    //     console.log("left score!!!!");
    // }
    // reset();
}

function wallCollission(objects) {
    objects.forEach(function(value, index, array) {
        if (value.recoil) {
            if(value.y + value.ry >= FrameHeight) {
                value.y = FrameHeight - value.ry;
                value.vy *= -elasticity;
                var rightScored = true;
                if(value.x > FrameWidth/2) {
                    rightScored = false;
                }
                goal(rightScored);
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
        }
        else {
            if(value.y + value.ry > FrameHeight) {
                value.y = FrameHeight - value.ry;
                value.vy = 0;
            }
            else if(value.y - value.ry <= 0) {
                value.y = value.ry;
                value.vy = 0;
            }
            if(value.x + value.rx > FrameWidth){
                value.x = FrameWidth - value.rx;
                value.vx = 0;
            } 
            else if (value.x - value.rx <= 0) {
                value.x = value.rx;
                value.vx = 0;
            }
        }

    });
}

function objectCollisions(objects) {
    objects.forEach(function (value1, index1, array) {
        for(var index2 = index1 + 1; index2 < array.length; index2++) {
            var value2 = array[index2];
            // Circle
            circleCollision(value1, value2);

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

function circleCollision(value1, value2) {
    // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    var dx = value1.x - value2.x;
    var dy = value1.y - value2.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < value1.rx + value2.rx) {

        var tot_energy = elasticity * (Math.abs(value1.vx) + Math.abs(value2.vx) + Math.abs(value1.vy) + Math.abs(value2.vy));

        var theta = Math.atan2(dy, dx);
        var xprop = Math.cos(theta);
        var yprop = Math.sin(theta);
        value1.newx = value2.x + xprop * (value1.rx + value2.rx);
        value1.newy = value2.y + yprop * (value1.ry + value2.ry);
        value2.newx = value1.x - xprop * (value1.rx + value2.rx);
        value2.newy = value1.y - yprop * (value1.rx + value2.rx);

        if (!value1.recoil) {
            energy2 = tot_energy;
            energy1 = 0;
            // value1.ax = 0;
            // value1.ay = 0;
            // value1.vx = 0;
            // value1.vy = 0;
        }
        else if(!value2.recoil) {
            energy1 = tot_energy;
            energy2 = 0;
            // value2.ax = 0;
            // value2.ay = 0;
            // value2.vx = 0;
            // value2.vy = 0;
        }
        else {
            var energySplit = tot_energy * 0.5;
            energy1 = energySplit;
            energy2 = energySplit;
        }

        if (value1.recoil) {
            value1.vx = energy1 * xprop;
            value1.vy = energy1 * yprop;
        }
        if(value2.recoil) {
            value2.vx = - energy2 * xprop;
            value2.vy = energy2 * yprop;
        }
    }
}

function updateKin(objects) {
    objects.forEach(function(value, index, array) {
        value.x = value.newx >= 0 ? value.newx : value.x;
        value.y = value.newy >= 0 ? value.newy : value.y;
        value.newx = -1;
        value.newy = -1;
        
        value.vx += value.ax / FrameRate;
        value.vy += value.ay / FrameRate;
        if (Math.abs(value.vy) > VertCap) {
            value.vy = Math.sign(value.vy) * VertCap;
        }
        if (Math.abs(value.vx) > HorzCap) {
            value.vx = Math.sign(value.vx) * HorzCap;
        }
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
