const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = new Player(canvas.height);
let obstacles = [];
let obstacleTimer = 0; // Time since last obstacle was created
let nextObstacleTime = 200;
let speedIncrease = 0;

let powerUps = [];
let powerUpTimer = 0; // Time since last obstacle was created
let nextPowerUpTime = 0;

let score = 0;


let bgImage = new Image();
bgImage.src = 'assets/background.jpeg'; // Replace with the path to your image

let tankerGO = new Image();
tankerGO.src = 'assets/tanker-gameover.jpeg';

let autoGO = new Image();
autoGO.src = 'assets/auto-gameover.jpeg';

let policeCarGO = new Image();
policeCarGO.src = 'assets/police-gameover.jpeg';

let bgX = 0; // Background X position
let scrollSpeed = 2; // Background scroll speed

let playerImage = new Image();
playerImage.src = 'assets/character.png';

let waterTanker = new Image();
waterTanker.src = 'assets/tanker.png';

let auto = new Image();
auto.src = 'assets/auto.png';

let policeCar = new Image();
policeCar.src = 'assets/police-car.png';

let pot = new Image();
pot.src = 'assets/pot.png';

let cloud = new Image();
cloud.src = 'assets/cloud.png';

function drawGround() {
    context.fillStyle = '#8B4513';
    context.fillRect(0, canvas.height - 20, canvas.width, 20);
}

function drawScore() {
    context.font = '24px Arial'; // Choose an appropriate size and font
    context.fillStyle = '#000'; // Text color
    context.fillText('Water Collected: ' + score + ' Litres', 10, 30); // Draw the score at the top left corner
}

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    // Adjust height to leave space for controls, if necessary
    canvas.height = window.innerHeight - document.getElementById('controls').offsetHeight;

    // Add your game's resizing logic here, if needed
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function handleObstacles() {
    // Check if it's time to create a new obstacle
    if (obstacleTimer >= nextObstacleTime) {

        //Randomly choose a type from 0 to 2
        let type = Math.floor(Math.random() * 3);

        let y = canvas.height - 20; // Y position based on height

        let minSpeed = 5; // Minimum speed
        let maxSpeed = 10; // Maximum speed
        let speed = Math.random() * (maxSpeed - minSpeed) + minSpeed + speedIncrease;

        obstacles.push(new Obstacle(canvas.width, canvas.height - 100, type, '#8B0000', speed));

        // Reset the timer and set a new random time for the next obstacle
        obstacleTimer = 0;
        let minInterval = 200; // Minimum interval time
        let maxInterval = 350; // Maximum interval time
        nextObstacleTime = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval);
    }

    obstacleTimer++; // Increment the timer every frame
    speedIncrease += 0.005; // Increase speed over time

    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 0);
        }
    });
}

function handlePowerUps() {
    // Check if it's time to create a new powerup
    if (powerUpTimer >= nextPowerUpTime) {


        //Randomly choose a type from 0 to 2
        let type = Math.floor(Math.random() * 2);

        let y = 2000; // Y position based on height

        let minSpeed = 5; // Minimum speed
        let maxSpeed = 10; // Maximum speed
        let speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

        powerUps.push(new PowerUp(canvas.width, canvas.height - 300, type, '#8B0000', speed));

        // Reset the timer and set a new random time for the next obstacle
        powerUpTimer = 0;
        let minInterval = 100; // Minimum interval time
        let maxInterval = 200; // Maximum interval time
        nextPowerUpTime = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval);
    }

    powerUpTimer++; // Increment the timer every frame

    powerUps.forEach((PowerUp, index) => {
        PowerUp.update();
        if (PowerUp.x + PowerUp.width < 0) {
            powerUps.splice(index, 1);
        }
    });
}


function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Rewind to the start if already playing
        sound.play();
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft': player.move('left'); break;
        case 'ArrowRight': player.move('right'); break;
        case 'ArrowUp': player.jump(); break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp': break;
        case ' ': player.stop(); break;
    }
    // player.stop(); // Stop lateral movement when arrow keys are released
});

// Listen for touch events on the left and right buttons
document.getElementById('leftBtn').addEventListener('touchstart', function (e) {
    e.preventDefault(); // Prevent the default touch behavior like scrolling
    player.move('left');
});
document.getElementById('leftBtn').addEventListener('touchend', function (e) {
    player.stop();
});

document.getElementById('rightBtn').addEventListener('touchstart', function (e) {
    e.preventDefault();
    player.move('right');
});
document.getElementById('rightBtn').addEventListener('touchend', function (e) {
    player.stop();
});

// Make the character jump when the jump button is touched
document.getElementById('jumpBtn').addEventListener('touchstart', function (e) {
    e.preventDefault();
    player.jump();
});


function drawBackground() {
    // Draw the first image
    context.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);

    // Draw the second image directly to the right of the first
    context.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);

    // Update the background X position
    bgX -= scrollSpeed;

    // Reset the background position to create a seamless loop
    if (bgX <= -canvas.width) {
        bgX = 0;
    }
}

function drawGameOverScreen(type) {
    switch (type) {
        case 0:
            context.drawImage(tankerGO, 0, 0, canvas.width, canvas.height);
            break;
        case 1:
            context.drawImage(autoGO, 0, 0, canvas.width, canvas.height);
            break;
        case 2:
            context.drawImage(policeCarGO, 0, 0, canvas.width, canvas.height);
            break;
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width - 10 &&
        rect1.x + rect1.width > rect2.x + 10 &&
        rect1.y < rect2.y + rect2.height - 5 &&
        rect1.y + rect1.height > rect2.y + 5;
}

function resetGame() {
    // Reset player position, obstacles, and any other necessary states
    player.x = 0;
    player.y = 0;
    score = 0; // Reset the score
    obstacles = [] // Clear existing obstacles
    powerUps = [] // Clear existing powerups
    // Add more reset logic as needed
}


let gameActive = true; // Keep track of the game state

function gameLoop() {
    console.log('Game loop running');
    if (!gameActive) return; // Stop the loop if the game is not active

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(); // Draw the scrolling background
    handleObstacles();
    handlePowerUps();

    obstacles.forEach(obstacle => {
        obstacle.draw(context);
        if (isColliding(player, obstacle)) {
            playSound('crashSound');
            gameActive = false; // Stop game
            showGameOverScreen(obstacle.type); // Show game over screen
            return;
        }
    });

    powerUps.forEach((powerUp, index) => {
        if (isColliding(player, powerUp)) {
            switch (powerUp.type) {
                case 0:
                    score += 10; // Increase score
                    break;
                case 1:
                    score += 20; // Increase score
                    break;
            }
            playSound('scoreSound');
            powerUps.splice(index, 1);
        } else {
            powerUp.draw(context);
        }
    });

    if (!gameActive) return; // Additional check to prevent further execution after collision

    player.update();
    player.draw(context);
    drawScore(); // Update and draw the score on the canvas

    requestAnimationFrame(gameLoop);
}

function showGameOverScreen(type) {
    // Assume you have a gameOverBackground and startAgainButton elements
    // document.getElementById('gameCanvas').style.display = 'block';
    drawGameOverScreen(type); // Draw the game over screen
    playSound('gameOverSound'); // Play the game over sound
    document.getElementById('resetButton').style.display = 'block';
    resetGame(); // Reset the game to its initial state
}

document.getElementById('resetButton').addEventListener('click', function () {
    // document.getElementById('gameCanvas').style.display = 'none';
    this.style.display = 'none'; // Hide the button
    gameActive = true;
    gameLoop(); // Restart the game loop
});



document.getElementById('startButton').addEventListener('click', function () {
    this.style.display = 'none'; // Hide the start button
    const music = document.getElementById('bgMusic');
    if (music.paused) {
        music.play(); // This should work since it's triggered by a user action
    }
    gameLoop(); // Start the game loop
});