const container = document.querySelector('.container');
let contDim = container.getBoundingClientRect();

const rand360 = Math.floor(Math.random() * 361);
const randCol1 = `hsl(${rand360}, 100%, 65%)`;
const randCol2 = `hsl(${rand360}, 100%, 50%)`;
const randCol3 = `hsl(${rand360}, 100%, 25%)`;

console.log(`${randCol1}\n${randCol2}`);

const body = document.querySelector("body");
body.style.background = `radial-gradient(${randCol1}, ${randCol3})`;


const gameover = document.createElement('div');
gameover.textContent = "Start Game";
gameover.style.position = "absolute";
gameover.style.color = "white";
gameover.style.lineHeight = "60px";
gameover.style.paddingTop = "60px";
gameover.style.height = "250px";
gameover.style.textAlign = "center";
gameover.style.fontSize = "3em";
gameover.style.textShadow = "2px 1px 2px rgba(0,0,0,0.5)";
gameover.style.textTransform = "uppercase";
gameover.style.background = `radial-gradient(${randCol1}, ${randCol2}`;
gameover.style.cursor = "pointer";
gameover.style.width = "100%";
gameover.addEventListener("click", startGame);
container.appendChild(gameover);

const ball = document.createElement('div');
ball.setAttribute('class', 'ball');
ball.style.position = "absolute";
ball.style.width = "20px";
ball.style.height = "20px";
ball.style.background = "rgba(255,255,255,0.3)";
ball.style.backdropFilter = "blur(30px)";
ball.style.borderRadius = "50%";
ball.style.top = "70%";
ball.style.left = "50%";
ball.style.display = "none";
container.appendChild(ball);


const paddle = document.createElement('div');
paddle.setAttribute('class', 'paddle');
paddle.style.position = "absolute";
paddle.style.height = "20px";
paddle.style.width = "100px";
paddle.style.borderRadius = "25px";

paddle.style.bottom = "30px";
paddle.style.left = "50%";
paddle.style.background = randCol2;
container.appendChild(paddle);

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) paddle.left = true;
    if (e.keyCode === 39) paddle.right = true;
    if (e.keyCode === 38 && !player.inPlay) player.inPlay = true;
})
document.addEventListener('keyup', e => {
    if (e.keyCode === 37) paddle.left = false;
    if (e.keyCode === 39) paddle.right = false;
})

const player = {
    gameover: true,
};

function startGame() {
    console.log('start');
    if (player.gameover) {
        player.gameover = false;
        gameover.style.display = "none";
        player.score = 0;
        player.lives = 5;
        player.inPlay = false;
        ball.style.display = "block";
        ball.style.left = paddle.offsetLeft + 50 + "px";
        ball.style.top = paddle.offsetTop + -30 + "px";
        player.ballDir = [3, 7];
        setupBricks(66);
        scoreUpdater();
        player.ani = window.requestAnimationFrame(update);
    }
}
function setupBricks(num) {
    let row = {
        x: (contDim.width % 100) / 2,
        y: 50,
    }
    let skip = false;
    for (let x = 0; x < num; x++) {
        console.log(row);
        if (row.x > (contDim.width - 100)) {
            row.y += 50;
            if (row.y > contDim.height / 2) skip = true;
            row.x = ((contDim.width % 100) / 2)
        }
        row.count = x;
        if (!skip) createBrick(row);
        row.x += 100;
    }
    function createBrick(pos) {
        const div = document.createElement('div');
        div.setAttribute('class', 'brick');
        div.style.backgroundColor = '#' + Math.random().toString(16).substr(-6);
        div.textContent = pos.count + 1;
        div.style.left = pos.x + 'px';
        div.style.top = pos.y + 'px';
        container.appendChild(div);
    }
}
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !((aRect.right < bRect.left) || (aRect.left > bRect.right) || (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom));

}
function scoreUpdater() {
    document.querySelector('.score').textContent = `Score: ${player.score}`;
    document.querySelector('.lives').textContent = `Lives: ${player.lives}`;
}

function update() {
    let pCurrent = paddle.offsetLeft;
    if (paddle.left && pCurrent > 0) pCurrent -= 20;
    if (paddle.right && (pCurrent < (contDim.width - paddle.offsetWidth))) pCurrent += 20;

    paddle.style.left = pCurrent + 'px';
    if (!player.inPlay) waitingOnPaddle();
    else moveBall();

    player.ani = window.requestAnimationFrame(update);
}
function waitingOnPaddle() {
    ball.style.top = (paddle.offsetTop - 21) + "px";
    ball.style.left = (paddle.offsetLeft + 40) + "px";
}
function fallOff() {
    player.lives--;
    if (player.lives < 0) {
        endGame();
        player.lives = 0;
    }
    scoreUpdater();
    stopper();
}
function endGame() {
    gameover.style.display = "block";
    gameover.innerHTML = `Game Over<br>Your score: ${player.score}`;
    player.gameover = true;
    ball.style.display = "none";
    let tempBricks = document.querySelectorAll(".brick");
    for (let tBrick of tempBricks) {
        tBrick.parentNode.removeChild(tBrick);
    }
}
function stopper() {
    player.inPlay = false;
    player.ballDir[0, -5];
    waitingOnPaddle();
    window.cancelAnimationFrame(player.ani);

}

function moveBall() {
    let posBall = {
        x: ball.offsetLeft,
        y: ball.offsetTop
    };
    if (posBall.y > (contDim.height - 20) || posBall.y < 0) {
        if (posBall.y > (contDim.height - 20)) {
            fallOff();
        } else {
            player.ballDir[1] *= -1;
        }
    };
    if (posBall.x > (contDim.width - 20) || posBall.x < 0) {
        player.ballDir[0] *= -1;
    };

    if (isCollide(paddle, ball)) {
        let temp = ((posBall.x - paddle.offsetLeft) - (paddle.offsetWidth / 2)) / 10;
        console.log('hit');
        player.ballDir[1] *= -1;
    };
    let bricks = document.querySelectorAll(".brick");
    if (bricks.length == 0) {
        stopper();
    }
    for (let tBrick of bricks) {
        if (isCollide(tBrick, ball)) {
            player.ballDir[1] *= -1.0;
            tBrick.parentNode.removeChild(tBrick);
            player.score++;
            scoreUpdater();
        }
    }
    posBall.y += player.ballDir[1];
    posBall.x += player.ballDir[0];
    ball.style.top = posBall.y + 'px';
    ball.style.left = posBall.x + 'px';


}

