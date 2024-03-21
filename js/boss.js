class Boss {
    constructor() {
        this.x = canvas.width - 500; // Start from the right edge of the canvas
        this.y = canvas.height; // Adjust based on your game design
        this.width = 500; // Adjust the size
        this.height = 500; // Adjust the size
        this.speed = -3; // Speed of the boss moving back and forth
        this.health = 100; // Boss health
        this.grounded = false; // Grounded status
    }

    draw(context) {
        context.drawImage(bossImg, this.x, this.y, this.width, this.height);
    }

    update() {
        // Move the boss back and forth
        this.x += this.speed;
        if (this.x + this.width > canvas.width || this.x < 600) {
            this.speed *= -1; // Change direction
        }

        // Ground collision
        if (this.y + this.height >= canvas.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.grounded = true;
        } else {
            this.grounded = false;
        }
    }

    shoot() {
        // Logic to create and launch a new obstacle towards the player
        let newObstacle = {
            // Define the obstacle properties like position and speed
            // You might want to base some properties (like position) on the boss's current position
        };
        obstacles.push(newObstacle); // Assuming 'obstacles' is your array of obstacles
    }
}