import { Position, Velocity } from "./vectors";

export class Ball {
    constructor(
        private ctx: CanvasRenderingContext2D,
        private position: Position,
        private radius: number,
        private velocity: Velocity = { x: 0, y: 0 },
        private colour: string = 'rgba(29, 0, 255, 0.5)',
        // private mass: number = Math.PI * radius ** 2,
    ) { };

    readonly draw = () => {
        this.ctx.save();
        const path = new Path2D();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colour;
        path.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill(path);
        this.ctx.restore();
    };

    readonly move = () => {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    readonly getPosition = () => this.position;

    readonly getRadius = () => this.radius;

    readonly getVelocity = () => this.velocity;

    readonly setVelocity = (velocity: Velocity) => {
        this.velocity = velocity;
    };
};

