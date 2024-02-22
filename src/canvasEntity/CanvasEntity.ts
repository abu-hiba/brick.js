import { Position, Velocity } from '../vectors';

export type CircleDimensions = { radius: number };
export type RectangleDimensions = { width: number, height: number };
export type Dimensions = CircleDimensions | RectangleDimensions;

export abstract class CanvasEntity<DimensionType extends Dimensions> {
    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected position: Position,
        protected dimensions: DimensionType,
        protected colour: string,
    ) { };

    abstract readonly draw: () => void;
    readonly getPosition = () => this.position;
    readonly getDimensions = () => this.dimensions;
};

export abstract class MovableCanvasEntity<DimensionType extends Dimensions> extends CanvasEntity<DimensionType> {
    constructor(
        ctx: CanvasRenderingContext2D,
        position: Position,
        protected velocity: Velocity,
        dimensions: DimensionType,
        colour: string,
    ) {
        super(ctx, position, dimensions, colour);
    };

    abstract readonly move: () => void;
    readonly getVelocity = () => this.velocity;
    readonly setVelocity = (velocity: Velocity) => {
        this.velocity = velocity
    };
}

