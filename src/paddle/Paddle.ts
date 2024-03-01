import { MovableCanvasEntity, RectangleDimensions } from "../canvasEntity";
import { Position, Velocity } from "../vectors";

export class Paddle extends MovableCanvasEntity<RectangleDimensions> {
    private canMove = true;

    constructor(
        position: Position,
        dimensions: RectangleDimensions = { width: 100, height: 62.5 },
        velocity: Velocity = { x: 0, y: 0 },
        colour: string = '#15161E',
    ) {
        super(position, velocity, dimensions, colour);
    };

    readonly draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.fillStyle = this.colour;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.dimensions.width, 
            this.dimensions.height,
        );
        ctx.restore();
    };

    readonly move = () => {
        if (!this.canMove) {
            this.canMove = true;
            return;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    readonly setCanMove = (canMove: boolean) => {
        this.canMove = canMove;
    };
};

