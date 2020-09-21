const ay = 2;
const jumpSpeed = -20;
const maxFallSpeed = 100;

class Player {
    constructor(ai) {
        this.color = 'rgba(' + Math.floor(Math.random() * 256) 
        + ',' + Math.floor(Math.random() * 256) + ',' 
        + Math.floor(Math.random() * 256) + ')';
        this.y = Math.floor(Math.random() * 500);
        this.x = 100;
        this.speed = 0;
        this.size = 30;
        this.dead = false;
        this.ai = ai;
    }

    die() {
        this.dead = true;
    }

    live() {
        this.speed += ay;
        if (this.speed > maxFallSpeed) {
            this.speed = maxFallSpeed;
        }
        this.y += this.speed;
        if (this.ai !== undefined && !this.dead) {
            const res = this.ai.decide(this.dyUp, this.dyDown, this.dx, this.speed);
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