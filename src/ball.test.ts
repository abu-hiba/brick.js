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

    it('should detect collision with right edge', () => {
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
            { x: 90, y: 50 },
            10,
            { x: 1, y: 1 }
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
        const mockCanvas = {
            getContext: (_contextId: string) => {
                return {} as CanvasRenderingContext2D;
            },
            width: 100,
            height: 100,
        } as HTMLCanvasElement;

        const ball = new Ball(
            mockCanvas,
            { x: 10, y: 50 },
            10,
            { x: -1, y: 1 }
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
        const mockCanvas = {
            getContext: (_contextId: string) => {
                return {} as CanvasRenderingContext2D;
            },
            width: 100,
            height: 100,
        } as HTMLCanvasElement;

        const ball = new Ball(
            mockCanvas,
            { x: 50, y: 90 },
            10,
            { x: 1, y: 1 }
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
        const mockCanvas = {
            getContext: (_contextId: string) => {
                return {} as CanvasRenderingContext2D;
            },
            width: 100,
            height: 100,
        } as HTMLCanvasElement;

        const ball = new Ball(
            mockCanvas,
            { x: 50, y: 10 },
            10,
            { x: 1, y: -1 }
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

