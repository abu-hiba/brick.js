type Vector = {
    x: number;
    y: number;
};

type Position = Vector;
type Velocity = Vector;

export class Ball {
    constructor(
        private position: Position,
        private radius: number,
        private velocity: Velocity = { x: 0, y: 0 },
        private colour: string = 'rgba(29, 0, 255, 0.5)',
        private mass: number = Math.PI * radius ** 2,
    ) {};

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const path = new Path2D();
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        path.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(path);
        ctx.restore();

        return path;
    };
};

