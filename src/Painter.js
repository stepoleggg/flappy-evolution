const paintPlayer = (ctx, player) => {
    if (player.dead) {
        return;
    }
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y - player.size / 2, player.size, player.size);
};

const paintTube = (ctx, tube) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(tube.x - tube.width / 2, 0, tube.width, tube.y - tube.size / 2);
    ctx.fillRect(tube.x - tube.width / 2, tube.y + tube.size / 2, tube.width, 500 - (tube.y + tube.size / 2));
}

const paintScore = (ctx, score) => {
    ctx.font = "48px serif";
    ctx.fillStyle = 'blue';
    ctx.fillText(score, 50, 50);
}

const paint = (ctx, world, score) => {
    ctx.clearRect(0, 0, 500, 500);
    for (let player of world.players) {
        paintPlayer(ctx, player);
    }
    for (let tube of world.tubes) {
        paintTube(ctx, tube);
    }
    paintScore(ctx, score);
};

export default paint;