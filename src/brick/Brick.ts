import { RectangleDimensions } from "../dimensions";
import { Position } from "../vectors";

export class Brick {
    constructor(
        private _position: Position,
        private _dimensions: RectangleDimensions,
        private colour: string,
        readonly points: number,
    ) { };

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

    public get dimensions() {
        return this._dimensions;
    }
    public set dimensions(value: RectangleDimensions) {
        this._dimensions = value;
    }

    public get position(): Position {
        return this._position;
    }
    public set position(value: Position) {
        this._position = value;
    }
};

