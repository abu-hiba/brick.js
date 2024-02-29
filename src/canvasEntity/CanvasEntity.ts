import { Position, Velocity } from '../vectors';

export type CircleDimensions = { radius: number };
export type RectangleDimensions = { width: number, height: number };
export type Dimensions = CircleDimensions | RectangleDimensions;

export abstract class CanvasEntity<DimensionType extends Dimensions> {
    constructor(
        protected position: Position,
        protected dimensions: DimensionType,
        protected colour: string,
    ) { };

    abstract readonly draw: (ctx: CanvasRenderingContext2D) => void;
    abstract readonly getBoundingBox: () => { width: number, height: number };
    readonly getPosition = () => this.position;
    readonly getDimensions = () => this.dimensions;
};

export abstract class MovableCanvasEntity<DimensionType extends Dimensions> extends CanvasEntity<DimensionType> {
    constructor(
        position: Position,
        protected velocity: Velocity,
        dimensions: DimensionType,
        colour: string,
    ) {
        super(position, dimensions, colour);
    };

    abstract readonly move: () => void;
    readonly getVelocity = () => this.velocity;
    readonly setVelocity = (velocity: Velocity) => {
        this.velocity = velocity
    };
}

