import { CircleDimensions } from "../dimensions";
import { Position, Velocity } from "../vectors";

export class Ball {
    private _canMove = false;

    constructor(
        private _position: Position,
        private _dimensions: CircleDimensions,
        private _velocity: Velocity = { x: 0, y: 0 },
        private colour: string = '#414868',
    ) {
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

    readonly move = () => {
        if (!this.canMove) {
            return;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    public get canMove() {
        return this._canMove;
    }
    public set canMove(value) {
        this._canMove = value;
    }

    public get position(): Position {
        return this._position;
    }
    public set position(value: Position) {
        this._position = value;
    }

    public get velocity(): Velocity {
        return this._velocity;
    }
    public set velocity(value: Velocity) {
        this._velocity = value;
    }

    public get dimensions(): CircleDimensions {
        return this._dimensions;
    }
};

