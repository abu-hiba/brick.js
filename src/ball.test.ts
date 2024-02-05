import { describe, expect, it, vi } from 'vitest';
import { Ball } from './ball';

describe('Ball', () => {
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
});

