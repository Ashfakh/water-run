class PowerUp {
    constructor(x, y, type, color, speed) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 75;
        this.type = type;
        this.color = color;
        this.speed = speed; // Constant speed for all obstacles
    }

    update() {
        this.x -= this.speed; // Move left at a constant speed
    }

    draw(context) {
        switch (this.type) {
            case 0:
                context.drawImage(pot, this.x, this.y, this.width, this.height);
                break;
            case 1:
                context.drawImage(cloud, this.x, this.y, this.width, this.height);
                break;
        }
    }
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