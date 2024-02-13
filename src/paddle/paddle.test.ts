import { afterEach, describe, expect, it, vi } from 'vitest';
import { Paddle } from '.';

const context = {
    save: () => { },
    fillStyle: '',
    fillRect: (_x: number, _y: number, _width: number, _height: number) => { },
    restore: () => { },
} as CanvasRenderingContext2D;

describe('Paddle class', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create an instance', () => {
            // Arrange
            const initialPosition = { x: 100, y: 100 };

            // Act
            const paddle = new Paddle(context, initialPosition);

            // Assert
            expect(paddle).toBeTruthy();
        });
    });

    describe('draw method', () => {
        it('should draw paddle', () => {
            // Arrange
            const initialPosition = { x: 100, y: 100 };

            const save = vi.spyOn(context, 'save');
            const fillRect = vi.spyOn(context, 'fillRect');
            const restore = vi.spyOn(context, 'restore');

            const paddle = new Paddle(context, initialPosition);

            // Act
            paddle.draw();

            // Assert
            expect(save).toHaveBeenCalledTimes(1);
            expect(fillRect).toHaveBeenCalledWith(100, 100, 28, 2);
            expect(fillRect).toHaveBeenCalledTimes(1);
            expect(restore).toHaveBeenCalledTimes(1);
        });
    });

    describe('move method', () => {
        it('should move paddle', () => {
            // Arrange
            const initialPosition = { x: 100, y: 100 };
            const initialVelocity = { x: 1, y: 1 };

            const paddle = new Paddle(
                context,
                initialPosition,
            );

            paddle.setVelocity(initialVelocity);

            // Act
            paddle.move();

            // Assert
            expect(paddle.getPosition()).toEqual({ x: 101, y: 101 });
            expect(paddle.getVelocity()).toEqual({ x: 1, y: 1 });
        });

        it('should not move paddle if canMove is false', () => {
            // Arrange
            const initialPosition = { x: 100, y: 100 };
            const initialVelocity = { x: 1, y: 1 };

            const paddle = new Paddle(
                context,
                initialPosition,
            );

            paddle.setVelocity(initialVelocity);
            paddle.setCanMove(false);

            // Act
            paddle.move();

            // Assert
            expect(paddle.getPosition()).toEqual({ x: 100, y: 100 });
            expect(paddle.getVelocity()).toEqual({ x: 1, y: 1 });
        });
    });
});

