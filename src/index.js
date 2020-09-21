
import Player from './Player.js';
import { Game, settings as gameSettings} from './Game.js';
import AI from './AI.js';
import Setting from './Setting.js';

const ctx = document.getElementById('root').getContext('2d');
ctx.fillRect(0,0,500,500);

const numberAIs = 100;
const numberGenerations = 1000;
const needScore = 100;

const generateAIs = (deadPlayers) => {
    let sumScore = 0;
    const probabilities = [];
    for (let deadIdx in deadPlayers) {
        const timeScore = deadPlayers[deadIdx].timeLife + 1;
        sumScore += timeScore;
        probabilities[deadIdx] = timeScore;
    }
    for (let probabilitiesIdx in probabilities) {
        probabilities[probabilitiesIdx] /= sumScore;
        if (probabilitiesIdx !== 0) {
            probabilities[probabilitiesIdx] += probabilities[probabilitiesIdx - 1];
        }
    }
    const ais = [];
    for (let i = 0; i < numberAIs; i++) {
        const rand = Math.random();
        let aiIdx = 0;
        while(probabilities[aiIdx] < rand) {
            aiIdx += 1;
        }
        const ai = new AI(deadPlayers[aiIdx].player.ai);
        ai.mutate(1 / (deadPlayers[aiIdx].score + 1));
        ais.push(ai);
    }
    return ais;
};

const copyAIs = (deadPlayers) => {
    const ais = [];
    for (let i = 0; i < numberAIs; i++) {
        const dead = deadPlayers[deadPlayers.length - 1];
        const ai = new AI(dead.player.ai);
        ai.mutate(1 / (dead.score + 1));
        ais.push(ai);
    }
    return ais;
}

async function learn(numberAIs, numberGenerations, needScore) {
    let passed = 0;
    let bestScore = 0;
    let bestAI;
    let ais = [];
    for (let i = 0; i < numberAIs; i++) {
        ais.push(new AI());
    }
    while(passed < numberGenerations && bestScore < needScore) {
        const players = [];
        for (let i = 0; i < numberAIs; i++) {
            players.push(new Player(ais[i]));
        }
        const game = new Game(players, ctx);
        const result = await game.start();
        const { deadPlayers, score } = result;
        if (score > bestScore) {
            bestScore = score;
        }
        ais = copyAIs(deadPlayers);
        passed += 1;
        document.getElementById('generation').innerHTML = `
            Поколение: ${passed}/${numberGenerations}<br>
            Кол-во особей: ${numberAIs}<br>
            Лучший результат: ${bestScore}/${needScore}`;
        bestAI = deadPlayers[deadPlayers.length - 1].player.ai;
    }
    return bestAI;
}

let testScoreSum = 0;
let testBestScore = 0;
let testGamesNum = 0;
async function test() {
    const bestAI = await learn(numberAIs, numberGenerations, needScore);
    while(true) {
        const game = new Game([new Player(bestAI)], ctx);
        const result = await game.start();
        if (result.score  > testBestScore) {
            testBestScore = result.score;
        }
        testGamesNum += 1;
        testScoreSum += result.score;
        document.getElementById('testing').innerHTML = `
            Обучено: ${JSON.stringify(bestAI)}<br>
            Лучший тестовый результат: ${testBestScore}<br>
            Тестовых игр: ${testGamesNum}<br>
            Средный тестовый результат: ${testScoreSum / testGamesNum}`;
    }
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

test();

// test(new Player(100, bestAI));