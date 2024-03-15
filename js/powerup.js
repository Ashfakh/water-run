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