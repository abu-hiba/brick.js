import { afterEach, describe, expect, it, vi } from 'vitest';
import { Ball } from './ball';

describe('Ball', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create an instance', () => {
        // Arrange
        const mockCanvas = {
            getContext: (_contextId: string) => { return {} as CanvasRenderingContext2D; },
        } as HTMLCanvasElement;

        const getContext = vi.spyOn(mockCanvas, 'getContext');

        // Act
        const ball = new Ball(mockCanvas, { x: 50, y: 50 }, 10);

        // Assert
        expect(ball).toBeTruthy();
        expect(getContext).toHaveBeenCalledWith('2d');
    });

    it('should throw if canvas context is not available', () => {
        // Arrange
        const mockCanvas = {
            getContext: (_contextId: string) => { return null; },
        } as HTMLCanvasElement;

        // Act
        const createBall = () => new Ball(mockCanvas, { x: 50, y: 50 }, 10);

        // Assert
        expect(createBall).toThrowError('Could not get canvas context');
    });

    it('should draw a ball', () => {
        // Arrange
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
        } as HTMLCanvasElement;

        const save = vi.spyOn(context, 'save');
        const beginPath = vi.spyOn(context, 'beginPath');
        const fill = vi.spyOn(context, 'fill');
        const restore = vi.spyOn(context, 'restore');

        const arc = vi.fn();
        const Path2DMock = vi.fn(() => ({ arc }));
        vi.stubGlobal('Path2D', Path2DMock);

        const ball = new Ball(mockCanvas, { x: 50, y: 50 }, 10);

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

    it('should move the ball', () => {
        // Arrange
        const mockCanvas = {
            getContext: (_contextId: string) => {
                return {} as CanvasRenderingContext2D;
            },
            width: 100,
            height: 100,
        } as HTMLCanvasElement;

        const ball = new Ball(
            mockCanvas,
            { x: 50, y: 50 },
            10,
            { x: 1, y: 1 }
        );

        // Act
        ball.move();

        // Assert
        expect(ball.position).toEqual({ x: 51, y: 51 });
    });
});

