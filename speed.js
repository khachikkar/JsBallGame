const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'https://pictures.pibig.info/uploads/posts/2023-04/thumbs/1680963783_pictures-pibig-info-p-gora-ararat-risunok-vkontakte-7.jpg'; // Replace with your image path

// Ball properties
const ball = {
    x: 100,
    y: canvas.height - 130,
    radius: 20,
    speed: 5,
    dx: 0,
    dy: 0
};

// Score and Timer variables
let score = 0;
let playerName = '';
let timeLeft = 3600;
let gameInterval;

// Arrays to hold falling balls and black balls
const fallingBalls = [];
const blackBalls = [];

// Falling ball properties
const fallingBallRadius = 10;
const fallingBallSpeed = 2;

// Black ball properties
const blackBallRadius = 15;
const blackBallSpeed = 4;

// Modal elements
const nameModal = document.getElementById('nameModal');
const scoreModal = document.getElementById('scoreModal');
const finalScoreText = document.getElementById('finalScore');
const startGameButton = document.getElementById('startGame');
const playAgainButton = document.getElementById('playAgain');

// Draw Background Image
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Draw Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = '#FF0000'; // Red color
    ctx.fill();
    ctx.closePath();
}

// Draw Score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 20, 30);
}

// Draw Timer
function drawTimer() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Time Left: ' + timeLeft, canvas.width - 150, 30);
}

// Create a Falling Ball
function createFallingBall() {
    const x = Math.random() * (canvas.width - fallingBallRadius * 2) + fallingBallRadius;
    fallingBalls.push({ x: x, y: -fallingBallRadius });
}

// Draw Falling Balls
function drawFallingBalls() {
    fallingBalls.forEach((fallingBall, index) => {
        ctx.beginPath();
        ctx.arc(fallingBall.x, fallingBall.y, fallingBallRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FF4500'; // Orange-red color for the small balls
        ctx.fill();
        ctx.closePath();

        // Move the falling balls down
        fallingBall.y += fallingBallSpeed;

        // Check for collision with the main red ball
        if (checkCollision(fallingBall, fallingBallRadius)) {
            fallingBalls.splice(index, 1); // Remove the ball from the array
            score++; // Increment the score
        }
    });
}

// Create a Black Ball
function createBlackBall() {
    const x = Math.random() * (canvas.width - blackBallRadius * 2) + blackBallRadius;
    blackBalls.push({ x: x, y: -blackBallRadius });
}

// Draw Black Balls
function drawBlackBalls() {
    blackBalls.forEach((blackBall, index) => {
        ctx.beginPath();
        ctx.arc(blackBall.x, blackBall.y, blackBallRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#000000'; // Black color for the balls
        ctx.fill();
        ctx.closePath();

        // Move the black balls down
        blackBall.y += blackBallSpeed;

        // Check for collision with the main red ball
        if (checkCollision(blackBall, blackBallRadius)) {
            blackBalls.splice(index, 1); // Remove the ball from the array
            score = 0; // Reset the score to 0
        }
    });
}

// Check Collision between the red ball and a falling ball
function checkCollision(ballObj, radius) {
    const distX = ball.x - ballObj.x;
    const distY = ball.y - ballObj.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < ball.radius + radius;
}

// Move Ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Boundary detection
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
    }
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
    }
}

// Draw the entire scene
function drawScene() {
    drawBackground(); // Draw the background image
    drawBall();
    drawScore();
    drawTimer();
    drawFallingBalls();
    drawBlackBalls();
}

// Update Game Frame
function update() {
    moveBall();
    drawScene();

    // Randomly create falling balls
    if (Math.random() < 0.03) {
        createFallingBall();
    }

    // Randomly create black balls
    if (Math.random() < 0.02) {
        createBlackBall();
    }
}

// Timer countdown
function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        endGame();
    }
}

// Start the game
function startGame() {
    playerName = document.getElementById('playerName').value || 'Player';
    nameModal.style.display = 'none';

    // Start the game loop and timer
    gameInterval = setInterval(() => {
        update();
        countdown();
    }, 1000/60); // 60 FPS
}

// End the game and show the score
function endGame() {
    clearInterval(gameInterval);
    scoreModal.style.display = 'block';
    finalScoreText.innerText = `${playerName}, your score is: ${score}`;
}

// Restart the game
function restartGame() {
    score = 0;
    timeLeft = 3600;
    fallingBalls.length = 0;
    blackBalls.length = 0;
    nameModal.style.display = 'block';
    scoreModal.style.display = 'none';
}

// Handle Key Down
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        ball.dx = ball.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        ball.dx = -ball.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        ball.dy = -ball.speed;
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        ball.dy = ball.speed;
    }
}

// Handle Key Up
function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        ball.dx = 0;
    } else if (
        e.key === 'ArrowUp' ||
        e.key === 'Up' ||
        e.key === 'ArrowDown' ||
        e.key === 'Down'
    ) {
        ball.dy = 0;
    }
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startGameButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', restartGame);

// Show the name modal on page load
window.onload = () => {
    nameModal.style.display = 'block';
};
