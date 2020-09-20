import paint from './Painter.js';
import Tube from './Tube.js';

const settings = {
    frameDelay: 40,
    timeout: 25,
};

class Game {
    constructor(players, ctx, after) {
        this.world = {
            players,
            tubes: [new Tube()],
        };
        this.ctx = ctx;
        this.counter = 0;
        this.lastPlayer = null;
        this.after = after;
        this.score = 0;
    }

    getWorld() {
        return this.world;
    }

    checkCollision(player) {
        for (let tube of this.world.tubes) {
            if ((player.x + player.size / 2 > tube.x - tube.width / 2 &&
                player.x + player.size / 2 < tube.x + tube.width / 2) ||
                (player.x - player.size / 2 < tube.x + tube.width / 2 &&
                player.x - player.size / 2 > tube.x - tube.width / 2)) {
                    if (player.y - player.size / 2 < tube.y - tube.size / 2 ||
                        player.y + player.size / 2 > tube.y + tube.size / 2) {
                            player.die();
                            return true;
                        }
                }
        }
        return false;
    }

    stop() {
        window.clearInterval(this.handler);
        this.after(this.lastPlayer);
    }

    start() {
        const live = () => {
            const nextTube = this.world.tubes[0];
            for (let tube of this.world.tubes) {
                tube.live();
            }
            for (let playerIdx in this.world.players) {
                const player = this.world.players[playerIdx];
                player.dx = nextTube.x - player.x;
                player.dy = nextTube.y - player.y;
                player.live();
                const dead = this.checkCollision(player);
                if (dead) {
                    this.world.players.splice(playerIdx, 1);
                    this.lastPlayer = player;
                }
            }
            if (this.ctx !== undefined) {
                paint(this.ctx, this.world, this.score);
            }
            this.counter += 1;
            if (this.counter == settings.timeout) {
                this.counter = 0;
                this.world.tubes.push(new Tube());
            }
            if (this.world.tubes.length > 0 && this.world.tubes[0].x < 180) {
                this.world.tubes.shift();
                this.score += 1;
            }
            if (this.world.players.length === 0) {
                this.stop();
            }
        }
        this.handler = window.setInterval(live, settings.frameDelay);
    }
}

export { Game, settings };