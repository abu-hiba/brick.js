import { CircleDimensions, MovableCanvasEntity } from "../canvasEntity";
import { Position, Velocity } from "../vectors";

export class Ball extends MovableCanvasEntity<CircleDimensions> {
    constructor(
        position: Position,
        dimensions: CircleDimensions,
        velocity: Velocity = { x: 0, y: 0 },
        colour: string = '#414868',
    ) {
        super(position, velocity, dimensions, colour);
    };

    readonly draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        const path = new Path2D();
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        path.arc(
            this.position.x,
            this.position.y,
            this.dimensions.radius,
            0,
            2 * Math.PI
        );
        ctx.fill(path);
        ctx.restore();
    };

    readonly getBoundingBox = () => {
        return {
            width: this.dimensions.radius * 2,
            height: this.dimensions.radius * 2
        };
    };

    readonly move = () => {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    readonly setPosition = (position: Position) => {
        this.position = position;
    };
};

