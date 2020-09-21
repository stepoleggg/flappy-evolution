class AI {
    constructor(parent) {
        this.weights = [];
        if (parent !== undefined) {
            this.weights[0] = parent.weights[0];
            this.weights[1] = parent.weights[1];
            this.weights[2] = parent.weights[2];
            this.weights[3] = parent.weights[3];
        } else {
            this.weights[0] = Math.random() - 0.5;
            this.weights[1] = Math.random() - 0.5;
            this.weights[2] = Math.random() - 0.5;
            this.weights[3] = Math.random() - 0.5;
        }
    }

    mutate(value) {
        const randomIdx = Math.floor(Math.random() * 4);
        const randomValue = (Math.random() - 0.5);// * value;
        this.weights[randomIdx] += randomValue;
    }

    decide(dyUp, dyDown, dx, sy) {
        const res = dyUp / 500 * this.weights[0] + 
        dx / 500 * this.weights[1] + sy / 100 * this.weights[2] + dyDown / 500 * this.weights[3];
        return res > 0.5;
    }
}

export default AI;