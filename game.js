
// UI Elements
const ui = document.getElementById("ui");
const welcomescreen = document.getElementById("welcomescreen");
const gameoverscreen = document.getElementById("gameoverscreen")
const scoreElement = document.getElementById("score");

const startGameButton = document.getElementById("start");
const restartGameButton = document.getElementById("restart");

const canvas = document.getElementById("game");

const scoreLabels = document.getElementsByClassName('score');
console.log(scoreLabels)

const ctx = canvas.getContext("2d");

const foregroundImage = new Image();
foregroundImage.src = "/assets/foreground.png"

canvas.width = document.getElementById("wrapper").getBoundingClientRect().width;
canvas.height = document.getElementById("wrapper").getBoundingClientRect().height;

// Game Variables
let defaultPlayerName = "precisepingu";
let currentPlayerName = defaultPlayerName;
let score = 0;
let power = 0;
let ballX = 92;
let ballY = 550;
let ballXVelocity = 5;
let ballYVelocity = -50;
let gravity = .5;

const hoopX = 244;
const hoopY = 320;

// Game States 
let started = false;
let hasGameOver = false;
let windingUp = false;
let throwing = false;
let hasScored = false;


// Drawing Game
function drawCloudLg() {
    const cloud = new Image();
    cloud.src = "/assets/cloud_lg.png"
    ctx.drawImage(cloud, 30, 50, 150, 61);
}

function drawCloudMed() {
    const cloud = new Image()
    cloud.src = "/assets/cloud_med.png"
    ctx.drawImage(cloud, 170, 150, 170, 50
    );
}

function drawCloudSmall() {
    const cloud = new Image()
    cloud.src = "/assets/cloud_s.png"
    ctx.drawImage(cloud, 40, 200, 92, 53
    );
}

function drawHoop() {
    const cloud = new Image()
    cloud.src = "/assets/bballhoop.png"
    ctx.drawImage(cloud, 230, 300, 146, 333);
}

function drawBball() {
    const cloud = new Image()
    cloud.src = "/assets/bball.png"
    ctx.drawImage(cloud, ballX, ballY, 36, 33);
}

function drawPlayer(state) {
    const player = new Image()
    player.src = "/assets/" + currentPlayerName + "_" + state + ".png"
    ctx.drawImage(player, 80, 480, 65, 153);
}

function drawSun() {
    const cloud = new Image()
    cloud.src = "/assets/sun.png"
    ctx.drawImage(cloud, canvas.width - 140, 10, 133.07, 133.07);
}

function drawPowerBar() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = 'red';

    ctx.beginPath();
    ctx.rect((canvas.width / 2) - 50, canvas.height - 100, power, 15)
    ctx.fill();

    ctx.beginPath();
    ctx.rect((canvas.width / 2) - 50, canvas.height - 100, 100, 15)
    ctx.stroke();

}


// Game Loop
function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#9EE8FF"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(foregroundImage, 0, canvas.height - 514.35, canvas.width, 514.35)


    if (throwing) {
        ballX += ballXVelocity;
        ballY += ballYVelocity;
        ballYVelocity += gravity;

        // Hit the floor
        if (ballY > 800) {
            gameover()
        }

        if ((ballX >= hoopX && ballX <= hoopX + 70)
            && (ballY >= hoopY && ballY <= hoopY + 70)) {

            if (!hasScored) {
                scored();
            }
        }


    }

    drawCloudLg();
    drawCloudMed();
    drawCloudSmall();
    drawHoop();
    drawPlayer(throwing ? 'shot' : 'idle');
    drawSun();
    drawBball();
    drawPowerBar();
    requestAnimationFrame(update);

}

update();

function start() {
    fadeOutAndHide(welcomescreen);
    canvas.style.filter = "none"
    ui.style.display = "none";
    started = true;
}

function restart() {
    fadeOutAndHide(gameoverscreen);
    canvas.style.filter = "none"
    ui.style.display = "none";

    resetGame();
    score = 0;
    updateScore(0)
}

function gameover() {
    ui.style.display = "flex";
    welcomescreen.style.display = "none";
    gameoverscreen.style.display = "block"
    gameoverscreen.style.opacity = "1"
    canvas.style.filter = "blur(12px)"
}

function resetGame() {
    ballX = 92;
    ballY = 550;
    ballXVelocity = 4;
    ballYVelocity = -50;
    throwing = false;
    hasScored = false;
}

function scored() {
    hasScored = true;
    score++;
    updateScore(score);
    resetGame();
}

function updateScore(score) {
    for (const label of scoreLabels) {
        label.textContent = "Score: " + score;
    };
}

function windup() {
    power = Math.min(power + 2, 100);
    windingUp = true;
}

function release() {
    windingUp = false;
    throwing = true;
    ballXVelocity = ballXVelocity * (power / 100);
    ballYVelocity = ballYVelocity * (power / 100);
    power = 0;
}

function fadeOutAndHide(div) {
    div.style.opacity = 0;
    div.addEventListener('transitionend', function () {
        div.style.display = 'none';
    }, { once: true });
}


let isTouching = false;
let touchInterval;


canvas.addEventListener('mousedown', function (e) {
    isTouching = true;
    startContinuousCheck();
});

canvas.addEventListener('mouseup', function (e) {
    isTouching = false;
    stopContinuousCheck();
});

canvas.addEventListener('touchstart', function (e) {
    isTouching = true;
    startContinuousCheck();
});

canvas.addEventListener('touchend', function (e) {
    isTouching = false;
    stopContinuousCheck();
});

function startContinuousCheck() {
    if (!touchInterval) {
        touchInterval = setInterval(() => {
            if (isTouching && !throwing) {
                windup();
            }
        }, 20);
    }
}

function stopContinuousCheck() {
    clearInterval(touchInterval);
    touchInterval = null;


    if (started && windingUp) {
        release();
    }
}

const playerSelectButtons = document.querySelectorAll('.player');

playerSelectButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        currentPlayerName = event.target.id;
    });
});



startGameButton.addEventListener('click', start);
restartGameButton.addEventListener('click', restart);

