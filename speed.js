const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'https://pictures.pibig.info/uploads/posts/2023-04/thumbs/1680963783_pictures-pibig-info-p-gora-ararat-risunok-vkontakte-7.jpg'; // Replace with your image path

// Colors
const skyColor = '#87CEEB'; // Light blue
const grassColor = '#228B22'; // Green
const sunColor = '#FFD700'; // Gold
const ballColor = '#FF0000'; // Red

// Dimensions
const landHeight = canvas.height / 4;
const grassHeight = 20; // Grass border height

// Ball properties
const ball = {
    x: 100,
    y: canvas.height - landHeight - grassHeight - 30,
    radius: 20,
    speed: 5,
    dx: 0,
    dy: 0
};

// Score variable
let score = 0;

// Array to hold falling balls
const fallingBalls = [];

// Falling ball properties
const fallingBallRadius = 10;
const fallingBallSpeed = 2;

// Draw Sky
function drawSky() {
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height - landHeight);
}

// Draw Background Image
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Draw Land
function drawLand() {
    ctx.fillStyle = '#8B4513'; // Brown soil color
    ctx.fillRect(0, canvas.height - landHeight, canvas.width, landHeight);

    // Draw grass border on top of the land
    ctx.fillStyle = grassColor;
    ctx.fillRect(0, canvas.height - landHeight - grassHeight, canvas.width, grassHeight);
}

// Draw Sun
function drawSun() {
    const sunX = canvas.width - 100;
    const sunY = 100;
    const sunRadius = 50;

    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = sunColor;
    ctx.fill();
    ctx.closePath();
}

// Draw Clouds
function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, false);
    ctx.arc(x + size, y + size / 2, size, 0, Math.PI * 2, false);
    ctx.arc(x + size * 2, y, size, 0, Math.PI * 2, false);
    ctx.fillStyle = '#FFFFFF'; // White color
    ctx.fill();
    ctx.closePath();
}

function drawClouds() {
    drawCloud(150, 100, 30);
    drawCloud(400, 150, 40);
    drawCloud(650, 80, 35);
}

// Draw Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
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
    if (ball.y + ball.radius > canvas.height - landHeight - grassHeight) {
        ball.y = canvas.height - landHeight - grassHeight - ball.radius;
    }
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

// Draw Score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 20, 30);
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

// Check Collision between the red ball and a falling ball
function checkCollision(fallingBall, fallingBallRadius) {
    const distX = ball.x - fallingBall.x;
    const distY = ball.y - fallingBall.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < ball.radius + fallingBallRadius;
}


// Array to hold black balls
const blackBalls = [];

// Black ball properties
const blackBallRadius = 15;
const blackBallSpeed = 4;

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


// Draw the entire scene
function drawScene() {
    drawSky();
    drawBackground()
    drawSun();
    drawClouds();
    drawLand();
    drawBall();
}

// Update Game Frame
function update() {
    moveBall();
    drawScene();
    drawScore();
    drawFallingBalls();
    drawBlackBalls();

    // Randomly create falling balls
    if (Math.random() < 0.03) { // Adjust probability to control frequency
        createFallingBall();
    }
    
    if (Math.random() < 0.02) { // Adjust probability to control frequency
        createBlackBall();
    }

    requestAnimationFrame(update);
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start the game
update();
