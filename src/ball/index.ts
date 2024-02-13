import { CanvasEntity, CircleDimensions } from "../canvasEntity";
import { Position, Velocity } from "../vectors";

export class Ball extends CanvasEntity<CircleDimensions> {
    constructor(
        ctx: CanvasRenderingContext2D,
        position: Position,
        dimensions: CircleDimensions,
        velocity: Velocity = { x: 0, y: 0 },
        colour: string = 'rgba(29, 0, 255, 0.5)',
        // private mass: number = Math.PI * radius ** 2,
    ) {
        super(ctx, position, velocity, dimensions, colour);
    };

    readonly draw = () => {
        this.ctx.save();
        const path = new Path2D();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colour;
        path.arc(this.position.x, this.position.y, this.dimensions.radius, 0, 2 * Math.PI);
        this.ctx.fill(path);
        this.ctx.restore();
    };

    readonly move = () => {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
};

