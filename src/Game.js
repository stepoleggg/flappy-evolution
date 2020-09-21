import paint from './Painter.js';
import Tube from './Tube.js';
import "core-js/stable";
import "regenerator-runtime/runtime";

const settings = {
    frameDelay: 40,
    timeout: 40,
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Game {
    constructor(players, ctx) {
        this.world = {
            players,
            tubes: [new Tube()],
        };
        this.ctx = ctx;
        this.counter = 0;
        this.score = 0;
        this.timeLife = 0;
        this.deadPlayers = [];
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

    async start() {
        const live = () => {
            const nextTube = this.world.tubes[0];
            for (let tube of this.world.tubes) {
                tube.live();
            }
            for (let playerIdx in this.world.players) {
                const player = this.world.players[playerIdx];
                player.dx = nextTube.x - player.x;
                player.dyUp = nextTube.y - nextTube.size / 2 - player.y;
                player.dyDown = nextTube.y + nextTube.size / 2 - player.y;
                player.live();
                const dead = this.checkCollision(player);
                if (dead) {
                    this.world.players.splice(playerIdx, 1);
                    this.deadPlayers.push({score: this.score, player});
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
            if (this.world.tubes.length > 0 && this.world.tubes[0].x < 80) {
                this.world.tubes.shift();
                this.score += 1;
            }
            this.timeLife += 1;
        }
        while(this.world.players.length > 0) {
            live();
            if (this.ctx !== undefined) {
                await sleep(settings.frameDelay);
            }
        }
        return {
            deadPlayers: this.deadPlayers,
            score: this.score,
            timeLife: this.timeLife,
        };
    }
}

export { Game, settings };