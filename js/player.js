class Player {
    constructor() {
        this.x = 150;
        this.y = 0;
        this.width = 75;
        this.height = 100;
        this.color = '#FF6347';
        this.velocityY = 0;
        this.velocityX = 0;
        this.speed = 5;
        this.gravity = 1;
        this.jumpForce = -20;
        this.grounded = false;
    }

    move(direction) {
        if (direction === 'left' && this.x > 0) {
            this.velocityX = -this.speed - 2;
        } else if (direction === 'right' && this.x + this.width < canvas.width) {
            this.velocityX = this.speed;
        }
    }

    stop() {
        this.velocityX = 0;
    }

    jump() {
        playSound('jumpSound');
        if (this.grounded) {
            this.velocityY = this.jumpForce; // Apply an initial force upwards
            this.grounded = false; // The player is now in the air
        }
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Gravity effect
        if (!this.grounded) {
            this.velocityY += this.gravity;
        } else {
            this.velocityY = 0;
        }

        // Ground collision
        if (this.y + this.height >= canvas.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        // Reset horizontal movement
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }

    draw(context) {
        // Save the current context state (settings, transformations, etc.)
        context.save();

        // Move the context origin to the center of the player for rotation
        context.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Rotate the context by a certain angle (in radians)
        // For example, to rotate 45 degrees: Math.PI / 4
        context.rotate(this.velocityY / 2); // Rotate by 45 degrees, change this value as needed

        // Draw the image with its center now at the origin, adjusting position to draw correctly
        context.drawImage(playerImage, -this.width / 2, -this.height / 2, this.width, this.height);

        // Restore the context to its original state
        context.restore();
    }
}