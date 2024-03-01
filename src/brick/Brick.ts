import { CanvasEntity, RectangleDimensions } from "../canvasEntity";
import { Position } from "../vectors";

export class Brick extends CanvasEntity<RectangleDimensions> {
    constructor(
        position: Position,
        dimensions: RectangleDimensions,
        colour: string,
        readonly points: number,
    ) {
        super(position, dimensions, colour);
    };

    readonly draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.fillStyle = this.colour;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.dimensions.width, 
            this.dimensions.height,
        );
        ctx.restore();
    };

    readonly getBoundingBox = () => {
        return this.dimensions;
    };
};

