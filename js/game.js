const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let player = new Player();
let boss;
let obstacles = [];
let obstacleTimer = 0; // Time since last obstacle was created
let nextObstacleTime = 200;
let speedIncrease = 0;

let powerUps = [];
let powerUpTimer = 0; // Time since last obstacle was created
let nextPowerUpTime = 0;

let fires = [];
let fireTimer = 0; // Time since last obstacle was created
let nextFireTime = 0;

let score = 0;


let bgImage = new Image();
bgImage.src = 'assets/background.jpeg'; // Replace with the path to your image

let tankerGO = new Image();
tankerGO.src = 'assets/tanker-gameover.jpeg';

let autoGO = new Image();
autoGO.src = 'assets/auto-gameover.jpeg';

let policeCarGO = new Image();
policeCarGO.src = 'assets/police-gameover.jpeg';

let bossGO = new Image();
bossGO.src = 'assets/boss-gameover.jpeg';

let winBg = new Image();
winBg.src = 'assets/winBG.jpeg';

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

let bossImg = new Image();
bossImg.src = 'assets/boss.png';

let flame = new Image();
flame.src = 'assets/flame.png';

let bossTimer = 0;


function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    // Adjust height to leave space for controls, if necessary
    canvas.height = window.innerHeight - document.getElementById('controls').offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

drawMessage('Controls:', canvas.width / 2, canvas.height / 1.5 - 50);
drawMessage('\n Left : Left Arrow Key ⬅️ \n Right : Right Arrow Key ➡️ \n Jump : Up Arrow key ⬆️', canvas.width / 2, canvas.height / 1.5, 300);


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

function drawBossBackground() {
    // Draw the first image
    context.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
    context.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);

}

function drawGameOverScreen(type) {
    switch (type) {
        case 0:
            context.drawImage(tankerGO, 0, 0, canvas.width, canvas.height);
            drawScore();
            drawMessage('Game Over! Oh no! The notorious Bangalore Tanker Mafia has foiled your grand plans. \n Your quest for water sovereignty has hit a drought, and it looks like they\'ve drained all your hopes and ambitions along with the city\'s water supply. Remember, when you play the game of tanks, you win or you dry up. Better luck next rainfall!', canvas.width / 2, canvas.height / 1.5);
            break;
        case 1:
            context.drawImage(autoGO, 0, 0, canvas.width, canvas.height);
            drawScore();
            drawMessage('Game Over! Yikes, you\'ve just had a bump-in with an auto rickshaw, and the situation\'s turned a bit dicey. The auto driver\'s not in the mood for pleasantries, especially in any language other than Kannada. It\'s a tough break, being a newcomer and all, trying to navigate the bustling streets and now, cultural nuances, with your mission to solve the water crisis coming to a screeching halt. It looks like this city\'s challenges are more than just about water. Better luck next time!', canvas.width / 2, canvas.height / 1.7);
            break;
        case 2:
            context.drawImage(policeCarGO, 0, 0, canvas.width, canvas.height);
            drawScore();
            drawMessage('Game Over! Whoop-whoop, that\'s the sound of the police! The cops have pulled you over for your daring helmet - less escapade.It seems your quest to quench the city\'s thirst has hit a roadblock, courtesy of the traffic laws. Pay the fine or argue your cause, but it looks like your water crisis adventure ends here in a tangle of red tape.', canvas.width / 2, canvas.height / 1.5);
            break;
        case 4:
            context.drawImage(bossGO, 0, 0, canvas.width, canvas.height);
            drawScore();
            drawMessage('The Drought Monster has gone full villain mode, swiping every last drop of our water! Looks like we\'re gearing up for a summer survival challenge with just a trickle to get by. It\'s a bummer how a combo of greed and not thinking ahead turned our city into a plot for an eco-thriller. Time to band together, water warriors! Let\'s get creative with conservation and start a revolution against those who treat our precious H2O like it\'s their personal splash pool. Save the drops, save the world!', canvas.width / 2, canvas.height / 1.7);
            break;
    }
}

function drawVictoryScreen(score) {
    context.drawImage(winBg, 0, 0, canvas.width, canvas.height);
    drawScore();
    drawMessage('You\'ve danced away from the clutches of the drought monster clutching ' + score + ' precious liters of water. But remember, the summer saga isn\'t over yet! Keep those conservation vibes strong and make every drop of water count!!!"', canvas.width / 2, canvas.height / 1.5);

}

let gameActive = true; // Keep track of the game state

let lastRenderTime = Date.now()
let deltaTime = 0


function gameLoop() {
    if (!gameActive) return; // Stop the loop if the game is not active

    if (score >= 500) {
        showLevelTransition(); // Call a function to handle level transition
        return; // Skip the rest of this loop iteration
    }


    deltaTime = Date.now() - lastRenderTime;
    if (deltaTime < 5) sleep((16 - deltaTime) / 1000); //limit to 60 FPS. Not a great approach, rendering has to be time based
    lastRenderTime = Date.now();

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

function bossLoop() {
    if (!gameActive) return; // Stop the loop if the game is not active

    deltaTime = Date.now() - lastRenderTime;
    if (deltaTime < 16) sleep((16 - deltaTime) / 1000); //limit to 60 FPS. Not a great approach, rendering has to be time based
    lastRenderTime = Date.now();

    bossTimer += 0.16;

    if (bossTimer >= 200) {
        gameActive = false
        showVictoryScreen();
        return;
    }

    if (score <= 0) {
        gameActive = false;
        showGameOverScreen(4);
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBossBackground(); // Draw the scrolling background
    // Handle


    if (!gameActive) return; // Additional check to prevent further execution after collision

    boss.update();
    boss.draw(context);

    handleFire();

    if (isColliding(player, boss)) {
        playSound('steamSound');
        playSound('crashSound')
        gameActive = false; // Stop game
        showGameOverScreen(4); // Show game over screen
        return;
    }

    fires.forEach((fire, index) => {
        fire.draw(context);
        if (isColliding(player, fire)) {
            playSound('steamSound');
            score -= 100; // Decrease score
            fires.splice(index, 1);
        }
    });

    player.update();
    player.draw(context);
    drawScore(); // Update and draw the score on the canvas
    drawBossTimer();

    requestAnimationFrame(bossLoop);
}

function showLevelTransition() {
    const message = "Drought Monster Incoming: Brace Yourself!";
    let visible = true;
    const intervalId = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        if (visible) {
            drawMessage(message, canvas.width / 2, canvas.height / 2); // Implement this function to draw the message
        }
        visible = !visible;
    }, 500); // Flash interval

    setTimeout(() => {
        clearInterval(intervalId); // Stop flashing after a period
        gameActive = true; // Resume game
        boss = new Boss(); // Create a new boss
        bossLoop(); // Continue with the game loop
    }, 3000); // Flash for 3 seconds before continuing
}

function showGameOverScreen(type) {
    // Assume you have a gameOverBackground and startAgainButton elements
    // document.getElementById('gameCanvas').style.display = 'block';
    drawGameOverScreen(type); // Draw the game over screen
    playSound('gameOverSound'); // Play the game over sound
    stopSound('bgMusic'); // Play the game over sound
    document.getElementById('resetButton').style.display = 'block';
    resetGame();
}

function showVictoryScreen() {
    drawVictoryScreen(score); // Draw the game over screen
    playSound('win'); // Play the game over sound
    stopSound('bgMusic'); // Play the game over sound
    document.getElementById('resetButton').style.display = 'block';
    resetGame();
}

function resetGame() {
    obstacles = []
    powerUps = []
    fires = []
    score = 0
    player.x = 0
    player.y = 0

}

document.getElementById('resetButton').addEventListener('click', function () {
    window.location.reload();
});



document.getElementById('startButton').addEventListener('click', function () {
    this.style.display = 'none'; // Hide the start button
    const music = document.getElementById('bgMusic');
    if (music.paused) {
        music.play(); // This should work since it's triggered by a user action
    }
    gameLoop(); // Start the game loop
});