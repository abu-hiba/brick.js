export class GameCanvas {
    private canvas: HTMLCanvasElement;
    readonly width: number;
    readonly height: number;
    readonly context: CanvasRenderingContext2D;

    constructor(selector: string) {
        const canvas = document.querySelector<HTMLCanvasElement>(selector);
        if (!canvas) {
            throw new Error('Canvas element not available');
        }
        this.canvas = canvas;

        const resolution = window.screen.availWidth / window.screen.availHeight;
        this.width = 1000;

        if (resolution < 1) {
            this.height = this.width / 1.6;
        } else {
            this.height = this.width / resolution;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Cannot get canvas context');
        }
        this.context = context;
    }
};

