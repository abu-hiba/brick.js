import { afterEach, describe, vi, it, expect } from 'vitest';
import { Brick } from '.';

const context = {
    save: () => { },
    fillStyle: '',
    fillRect: (_x: number, _y: number, _width: number, _height: number) => { },
    restore: () => { },
} as CanvasRenderingContext2D;

describe('Brick class', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create an instance', () => {
            // Arrange
            const initialPosition = { x: 100, y: 100 };

            // Act
            const brick = new Brick(initialPosition, { width: 28, height: 2 }, 'black', 1);

            // Assert
            expect(brick).toBeTruthy();
        });
    });

    describe('draw method', () => {
        it('should draw brick', () => {
            // Arrange
            const initialPosition = { x: 100, y: 100 };

            const save = vi.spyOn(context, 'save');
            const fillRect = vi.spyOn(context, 'fillRect');
            const restore = vi.spyOn(context, 'restore');

            const brick = new Brick(initialPosition, { width: 28, height: 2 }, 'black', 1);

            // Act
            brick.draw(context);

            // Assert
            expect(save).toHaveBeenCalledTimes(1);
            expect(fillRect).toHaveBeenCalledWith(100, 100, 28, 2);
            expect(fillRect).toHaveBeenCalledTimes(1);
            expect(restore).toHaveBeenCalledTimes(1);
        });
    });
});

