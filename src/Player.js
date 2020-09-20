const ay = 2;
const jumpSpeed = -20;

class Player {
    constructor(ai) {
        this.color = 'rgba(' + Math.floor(Math.random() * 256) 
        + ',' + Math.floor(Math.random() * 256) + ',' 
        + Math.floor(Math.random() * 256) + ')';
        this.y = Math.floor(Math.random() * 500);
        this.x = 200;
        this.speed = 0;
        this.size = 40;
        this.dead = false;
        this.ai = ai;
    }

    die() {
        this.dead = true;
    }

    live() {
        this.speed += ay;
        this.y += this.speed;
        if (this.ai !== undefined && !this.dead) {
            const res = this.ai.decide(this.dy, this.dx, this.speed);
            if (res) {
                this.jump();
            }
        }
    }

    jump() {
        this.speed = jumpSpeed;
    }
}

export default Player;