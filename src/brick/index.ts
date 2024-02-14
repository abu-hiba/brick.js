import { CanvasEntity, RectangleDimensions } from "../canvasEntity";
import { Position } from "../vectors";

export class Brick extends CanvasEntity<RectangleDimensions> {
    constructor(
        ctx: CanvasRenderingContext2D,
        position: Position,
        dimensions: RectangleDimensions,
        colour: string,
    ) {
        super(ctx, position, dimensions, colour);
    };

    readonly draw = () => {
        this.ctx.save();
        this.ctx.fillStyle = this.colour;
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.dimensions.width, 
            this.dimensions.height,
        );
        this.ctx.restore();
    };
};

