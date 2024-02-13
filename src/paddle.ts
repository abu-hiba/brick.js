import { CanvasEntity, RectangleDimensions } from "./canvasEntity";
import { Position, Velocity } from "./vectors";

export class Paddle extends CanvasEntity<RectangleDimensions> {
    private canMove = true;

    constructor(
        ctx: CanvasRenderingContext2D,
        position: Position,
        dimensions: RectangleDimensions = { width: 28, height: 2 },
        velocity: Velocity = { x: 0, y: 0 },
        colour: string = 'black',
    ) {
        super(ctx, position, velocity, dimensions, colour);
    };

    readonly draw = () => {
        this.ctx.save();
        this.ctx.fillStyle = this.colour;
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.dimensions.width, 
            this.dimensions.height,
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

    readonly setCanMove = (canMove: boolean) => {
        this.canMove = canMove;
    };
};

