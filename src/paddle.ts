import { Position } from "./vectors";

export class Paddle {
    private ctx: CanvasRenderingContext2D;

    constructor(
        private canvas: HTMLCanvasElement,
        private position: Position,
        private width: number = 20,
        private height: number = 5,
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
}
