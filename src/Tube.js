const holeSize = 150;
const holeWidth = 40;
const speed = 10;

class Tube {
    constructor() {
        this.y = Math.random() * 300 + 100;
        this.x = 500 + holeWidth;
        this.size = holeSize;
        this.width = holeWidth;
    }

    live() {
        this.x -= speed;
    }
}

export default Tube;