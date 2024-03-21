class Obstacle {
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
                context.drawImage(waterTanker, this.x, this.y, this.width, this.height);
                break;
            case 1:
                context.drawImage(auto, this.x, this.y, this.width, this.height);
                break;
            case 2:
                context.drawImage(policeCar, this.x, this.y, this.width, this.height);
                break;
        }
    }

}

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
    speedIncrease += 0.0025; // Increase speed over time

    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 0);
        }
    });
}