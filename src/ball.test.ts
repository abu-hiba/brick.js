import { afterEach, describe, expect, it, vi } from 'vitest';
import { Ball } from './ball';

const context = {
    save: () => { },
    beginPath: () => { },
    fillStyle: '',
    fill: () => { },
    restore: () => { },
} as CanvasRenderingContext2D;

const mockCanvas = {
    getContext: (_contextId: string) => {
        return context;
    },
    width: 100,
    height: 100,
} as HTMLCanvasElement;

const RADIUS = 10;

describe('Ball class', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create an instance', () => {
            // Arrange
            const getContext = vi.spyOn(mockCanvas, 'getContext');
            const initialPosition = { x: 50, y: 50 };

            // Act
            const ball = new Ball(mockCanvas, initialPosition, RADIUS);

            // Assert
            expect(ball).toBeTruthy();
            expect(getContext).toHaveBeenCalledWith('2d');
        });

        it('should throw if canvas context is not available', () => {
            // Arrange
            const mockCanvas = {
                getContext: (_contextId: string) => { return null; },
            } as HTMLCanvasElement;

            const initialPosition = { x: 50, y: 50 };

            // Act
            const createBall = () => new Ball(
                mockCanvas,
                initialPosition,
                RADIUS
            );

            // Assert
            expect(createBall).toThrowError('Could not get canvas context');
        });
    });

    describe('draw method', () => {
        it('should draw a ball', () => {
            // Arrange
            const initialPosition = { x: 50, y: 50 };

            const save = vi.spyOn(context, 'save');
            const beginPath = vi.spyOn(context, 'beginPath');
            const fill = vi.spyOn(context, 'fill');
            const restore = vi.spyOn(context, 'restore');

            const arc = vi.fn();
            const Path2DMock = vi.fn(() => ({ arc }));
            vi.stubGlobal('Path2D', Path2DMock);

            const ball = new Ball(mockCanvas, initialPosition, RADIUS);

            // Act
            ball.draw();

            // Assert
            expect(save).toHaveBeenCalledTimes(1);
            expect(Path2DMock).toHaveBeenCalledTimes(1);
            expect(beginPath).toHaveBeenCalledTimes(1);
            expect(arc).toHaveBeenCalledWith(50, 50, 10, 0, 2 * Math.PI);
            expect(arc).toHaveBeenCalledTimes(1);
            expect(fill).toHaveBeenCalledWith(Path2DMock());
            expect(fill).toHaveBeenCalledTimes(1);
            expect(restore).toHaveBeenCalledTimes(1);
        });
    });

    describe('move method', () => {
        it('should move the ball', () => {
            // Arrange
            const initialPosition = { x: 50, y: 50 };
            const initialVelocity = { x: 1, y: 1 };

            const ball = new Ball(
                mockCanvas,
                initialPosition,
                RADIUS,
                initialVelocity
            );

            // cast to any to access private method
            const detectCollision = vi.spyOn(ball as any, 'detectCollision');

            // Act
            ball.move();

            // Assert
            // cast to any to access private properties
            const position = (ball as any).position;
            const velocity = (ball as any).velocity;
            expect(position).toEqual({ x: 51, y: 51 });
            expect(velocity).toEqual({ x: 1, y: 1 });
            expect(detectCollision).toHaveBeenCalledTimes(1);
        });
    });

    describe('detectCollision method', () => {
        it('should detect collision with right edge', () => {
            // Arrange
            const initialPosition = { x: 90, y: 50 };
            const initialVelocity = { x: 1, y: 1 };

            const ball = new Ball(
                mockCanvas,
                initialPosition,
                RADIUS,
                initialVelocity
            );

            // cast to any to access private method
            const detectCollision = vi.spyOn(ball as any, 'detectCollision');

            // Act
            ball.move();
            ball.move();

            // Assert
            // cast to any to access private porperty
            const velocity = (ball as any).velocity;
            const position = (ball as any).position;
            expect(velocity).toEqual({ x: -1, y: 1 });
            expect(position).toEqual({ x: 90, y: 52 });
            expect(detectCollision).toHaveBeenCalledTimes(2);
        });

        it('should detect collision with left edge', () => {
            // Arrange
            const initialPosition = { x: 10, y: 50 };
            const initialVelocity = { x: -1, y: 1 };

            const ball = new Ball(
                mockCanvas,
                initialPosition,
                RADIUS,
                initialVelocity
            );

            // cast to any to access private method
            const detectCollision = vi.spyOn(ball as any, 'detectCollision');

            // Act
            ball.move();
            ball.move();

            // Assert
            // cast to any to access private porperty
            const velocity = (ball as any).velocity;
            const position = (ball as any).position;
            expect(velocity).toEqual({ x: 1, y: 1 });
            expect(position).toEqual({ x: 10, y: 52 });
            expect(detectCollision).toHaveBeenCalledTimes(2);
        });

        it('should detect collision with bottom edge', () => {
            // Arrange
            const initialPosition = { x: 50, y: 90 };
            const initialVelocity = { x: 1, y: 1 };

            const ball = new Ball(
                mockCanvas,
                initialPosition,
                RADIUS,
                initialVelocity
            );

            // cast to any to access private method
            const detectCollision = vi.spyOn(ball as any, 'detectCollision');

            // Act
            ball.move();
            ball.move();

            // Assert
            // cast to any to access private properties
            const velocity = (ball as any).velocity;
            const position = (ball as any).position;
            expect(velocity).toEqual({ x: 1, y: -1 });
            expect(position).toEqual({ x: 52, y: 90 });
            expect(detectCollision).toHaveBeenCalledTimes(2);
        });

        it('should detect collision with top edge', () => {
            // Arrange
            const initialPosition = { x: 50, y: 10 };
            const initialVelocity = { x: 1, y: -1 };

            const ball = new Ball(
                mockCanvas,
                initialPosition,
                RADIUS,
                initialVelocity
            );

            // cast to any to access private method
            const detectCollision = vi.spyOn(ball as any, 'detectCollision');

            // Act
            ball.move();
            ball.move();

            // Assert
            // cast to any to access private properties
            const velocity = (ball as any).velocity;
            const position = (ball as any).position;
            expect(velocity).toEqual({ x: 1, y: 1 });
            expect(position).toEqual({ x: 52, y: 10 });
            expect(detectCollision).toHaveBeenCalledTimes(2);
        });
    });
});

