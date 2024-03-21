function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Rewind to the start if already playing
        sound.play();
    }
}

function stopSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Rewind to the start if already playing
        sound.pause();
    }
}

function drawScore() {
    let centerX = canvas.width / 3.5
    let centerY = 50;
    if (!gameActive) {
        centerX = canvas.width / 2;
        centerY = canvas.height / 3;
        drawMessage('You\'ve collected ' + score + ' Litres of water', centerX, centerY);
    } else {
        drawMessage('Water Meter :', centerX, centerY);
        drawProgressBar(1.5 * centerX, .5 * centerY, score, 500, 300, 30);
    }

}

function drawBossTimer() {
    let centerX = canvas.width / 3.5
    let centerY = 140;
    drawMessage('Boss Timer :', centerX, centerY);
    drawProgressBar(1.5 * centerX, 0.76 * centerY, 200 - bossTimer, 200, 500, 30, '#fc0000');

}

function drawProgressBar(x, y, currentScore, maxScore, barWidth, barHeight, fillColor = '#00f') {
    // Calculate the width of the filled part based on the current score
    let filledWidth = (currentScore / maxScore) * barWidth;

    // Draw the background of the progress bar
    context.fillStyle = '#ddd'; // Light grey background
    context.fillRect(x, y, barWidth, barHeight);

    // Draw the filled part of the progress bar
    context.fillStyle = fillColor; // Blue fill
    context.fillRect(x, y, Math.min(filledWidth, barWidth), barHeight);

    // Optionally, draw a border around the progress bar
    context.strokeStyle = '#000'; // Black border
    context.strokeRect(x, y, barWidth, barHeight);
}

function drawMessage(message, centerX, startY, maxWidth = 1300) {
    // Setting the pixel font
    context.font = '24px "Press Start 2P"';
    context.fillStyle = '#000'; // Text fill color
    context.textAlign = 'center'; // Center align text
    context.strokeStyle = '#FFF'; // White border
    context.lineWidth = 6; // Border width

    let lineHeight = 30; // Height of a line of text, adjust as needed
    let lines = splitMessageIntoLines(message, maxWidth);

    lines.forEach((line, index) => {
        let y = startY + (index * lineHeight);
        // Draw the text border for each line
        context.strokeText(line, centerX, y);
        // Fill the text after drawing the border for a clear, readable appearance
        context.fillText(line, centerX, y);
    });
}

function splitMessageIntoLines(text, maxWidth) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width - 10 &&
        rect1.x + rect1.width > rect2.x + 10 &&
        rect1.y < rect2.y + rect2.height - 5 &&
        rect1.y + rect1.height > rect2.y + 5;
}

function sleep(seconds) {
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) { }
}