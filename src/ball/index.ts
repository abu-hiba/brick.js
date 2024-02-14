import { CircleDimensions, MovableCanvasEntity } from "../canvasEntity";
import { Position, Velocity } from "../vectors";

export class Ball extends MovableCanvasEntity<CircleDimensions> {
    constructor(
        ctx: CanvasRenderingContext2D,
        position: Position,
        dimensions: CircleDimensions,
        velocity: Velocity = { x: 0, y: 0 },
        colour: string = '#414868',
    ) {
        super(ctx, position, velocity, dimensions, colour);
    };

    readonly draw = () => {
        this.ctx.save();
        const path = new Path2D();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colour;
        path.arc(
            this.position.x,
            this.position.y,
            this.dimensions.radius,
            0,
            2 * Math.PI
        );
        this.ctx.fill(path);
        this.ctx.restore();
    };

    readonly move = () => {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    readonly setPosition = (position: Position) => {
        this.position = position;
    };
};

