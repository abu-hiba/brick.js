import { afterEach, describe, expect, it, vi } from 'vitest';
import { Ball } from './ball';

const context = {
    save: () => { },
    beginPath: () => { },
    fillStyle: '',
    fill: () => { },
    restore: () => { },
} as CanvasRenderingContext2D;

const RADIUS = 10;

describe('Ball class', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create an instance', () => {
            // Arrange
            const initialPosition = { x: 50, y: 50 };

            // Act
            const ball = new Ball(context, initialPosition, RADIUS);

            // Assert
            expect(ball).toBeTruthy();
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

            const ball = new Ball(context, initialPosition, RADIUS);

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
                context,
                initialPosition,
                RADIUS,
                initialVelocity
            );

            // Act
            ball.move();

            // Assert
            // cast to any to access private properties
            const position = (ball as any).position;
            const velocity = (ball as any).velocity;
            expect(position).toEqual({ x: 51, y: 51 });
            expect(velocity).toEqual({ x: 1, y: 1 });
        });
    });
});

