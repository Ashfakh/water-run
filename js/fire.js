class Fire {
    constructor(x, y, vely, color, speed, airSpeed = 0.5) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 75;
        this.color = color;
        this.velx = speed;
        this.vely = vely;
        this.airSpeed = airSpeed
        this.gravity = 1;
        this.grounded = false;
    }

    update() {

        if (!this.grounded) {
            this.x -= this.airSpeed
        } else {
            this.x -= this.velx;
        }

        this.y += this.vely;


        if (!this.grounded) {
            this.vely += this.gravity;
        } else {
            this.vely = 0;
        }

        if (this.y + this.height >= canvas.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.grounded = true;
        } else {
            this.grounded = false;
        }
    }

    draw(context) {
        context.drawImage(flame, this.x, this.y, this.width, this.height);
    }

}

function handleFire() {
    // Check if it's time to create a new obstacle
    if (fireTimer >= nextFireTime) {

        let minSpeed = 10; // Minimum speed
        let maxSpeed = 12; // Maximum speed
        let speed = Math.random() * (maxSpeed - minSpeed) + minSpeed + speedIncrease;
        let throwSpeed = Math.random() * (30 - 10) + minSpeed;
        let airSpeed = Math.random() * (3) + 1;


        fires.push(new Fire(boss.x, boss.y, -throwSpeed, '#8B0000', speed, airSpeed));

        // Reset the timer and set a new random time for the next obstacle
        fireTimer = 0;
        let minInterval = 30; // Minimum interval time
        let maxInterval = 75; // Maximum interval time
        nextFireTime = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval);
    }

    fireTimer++; // Increment the timer every frame
    speedIncrease += 0.01; // Increase speed over time

    fires.forEach((fire, index) => {
        fire.update();
        if (fire.x + fire.width < 0) {
            fires.splice(index, 0);
        }
    });
}