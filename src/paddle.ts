import { Position, Velocity } from "./vectors";

export class Paddle {
    private ctx: CanvasRenderingContext2D;
    private canMove = true;

    constructor(
        private canvas: HTMLCanvasElement,
        private position: Position,
        private width: number = 28,
        private height: number = 2,
        private velocity: Velocity = { x: 0, y: 0 },
        private color: string = 'black',
    ) {
        const context = this.canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');
        this.ctx = context;
    };

    readonly draw = () => {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        this.ctx.restore();
    };

    readonly move = () => {
        if (!this.canMove) {
            this.canMove = true;
            return;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    readonly getPosition = () => this.position;

    readonly getWidth = () => this.width;

    readonly getHeight = () => this.height;

    readonly getVelocity = () => this.velocity;

    readonly setVelocity = (velocity: Velocity) => {
        this.velocity = velocity;
    };

    readonly setCanMove = (canMove: boolean) => {
        this.canMove = canMove;
    };
};

