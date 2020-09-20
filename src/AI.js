class AI {
    constructor(parent) {
        this.weights = [];
        if (parent !== undefined) {
            this.weights[0] = parent.weights[0];
            this.weights[1] = parent.weights[1];
            this.weights[2] = parent.weights[2];
        } else {
            this.weights[0] = Math.random();
            this.weights[1] = Math.random();
            this.weights[2] = Math.random();
        }
    }

    mutate() {
        const randomIdx = Math.floor(Math.random() * 3);
        const randomValue = Math.random() - 0.5;
        this.weights[randomIdx] += randomValue;
    }

    decide(dy, dx, sy) {
        const res = dy / 500 * this.weights[0] + 
        dx / 500 * this.weights[1] + sy / 150 * this.weights[2];
        return res > 0.5;
    }
}

export default AI;