import { RectangleDimensions } from "../dimensions";
import { Position, Velocity } from "../vectors";

export class Paddle {
    private _canMove = true;

    constructor(
        private _position: Position,
        private _dimensions: RectangleDimensions = { width: 100, height: 62.5 },
        private _velocity: Velocity = { x: 0, y: 0 },
        private colour: string = '#15161E',
    ) {
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

    public get velocity(): Velocity {
        return this._velocity;
    }
    public set velocity(value: Velocity) {
        this._velocity = value;
    }
    public get dimensions(): RectangleDimensions {
        return this._dimensions;
    }
    public get position(): Position {
        return this._position;
    }
    public get canMove() {
        return this._canMove;
    }
    public set canMove(value) {
        this._canMove = value;
    }
};

