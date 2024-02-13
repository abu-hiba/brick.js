import { Position, Velocity } from '../vectors';

export type CircleDimensions = { radius: number };
export type RectangleDimensions = { width: number, height: number };
export type Dimensions = CircleDimensions | RectangleDimensions;

export abstract class CanvasEntity<DimensionType extends Dimensions> {
    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected position: Position,
        protected velocity: Velocity,
        protected dimensions: DimensionType,
        protected colour: string,
    ) { };

    abstract readonly draw: () => void;
    abstract readonly move: () => void;
    readonly getPosition = () => this.position;
    readonly getVelocity = () => this.velocity;
    readonly getDimensions = () => this.dimensions;
    readonly setVelocity = (velocity: Velocity) => { this.velocity = velocity };
};

