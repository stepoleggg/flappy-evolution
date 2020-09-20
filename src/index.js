
import Player from './Player.js';
import { Game, settings as gameSettings} from './Game.js';
import AI from './AI.js';
import Setting from './Setting.js';

const ctx = document.getElementById('root').getContext('2d');
ctx.fillRect(0,0,500,500);

const numberAIs = 200;
const numberGenerations = 1000;
let passed = 0;

let ais = [];

function learn(player) {
    let bestAI;
    if (player === undefined) {
        for (let i = 0; i < numberAIs; i++) {
            ais.push(new AI());
        }
    } else {
        bestAI = player.ai;
        ais = []
        ais.push(bestAI);
        for (let i = 0; i < numberAIs - 1; i++) {
            const ai = new AI(bestAI);
            ai.mutate();
            ais.push(ai);
        }
    }
    
    passed += 1;
    if (passed > numberGenerations) {
        console.log('ended');
        console.log(bestAI);
        return;
    }
    document.getElementById('generation').innerHTML = `Поколение: ${passed}/${numberGenerations}<br>Кол-во особей: ${numberAIs}`;

    const players = [];
    for (let i = 0; i < numberAIs; i++) {
        players.push(new Player(ais[i]));
    }
    const game = new Game(players, ctx, learn);
    game.start();
}

function test(player) {
    const game = new Game([new Player(player.ai)], ctx, test);
    game.start();
}

const inputsRealtime = [];
inputsRealtime.push(new Setting('Задержка кадра в мс', parseInt, (value) => { gameSettings.frameDelay = value }, () => gameSettings.frameDelay));

for (let input of inputsRealtime) {
    document.getElementById('realtime-settings').innerHTML += input.getBody();
}

document.getElementById('apply').onclick = () => {
    for (let input of inputsRealtime) {
        input.apply();
    }
}

learn();

// test(new Player(100, bestAI));