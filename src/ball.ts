type Vector = {
    x: number;
    y: number;
};

type Position = Vector;
type Velocity = Vector;

export class Ball {
    private ctx: CanvasRenderingContext2D;

    constructor(
        private canvas: HTMLCanvasElement,
        private position: Position,
        private radius: number,
        private velocity: Velocity = { x: 0, y: 0 },
        private colour: string = 'rgba(29, 0, 255, 0.5)',
        // private mass: number = Math.PI * radius ** 2,
    ) {
        const context = this.canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');
        this.ctx = context;
    };

    readonly draw = () => {
        this.ctx.save();
        const path = new Path2D();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colour;
        path.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill(path);
        this.ctx.restore();
    };

    readonly move = () => {
        this.detectCollision();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    private detectCollision = () => {
        const collidesWithRightEdge =
            this.position.x > this.canvas.width - this.radius;
        const collidesWithLeftEdge =
            this.position.x < this.radius;
        const collidesWithBottomEdge =
            this.position.y > this.canvas.height - this.radius;
        const collidesWithTopEdge =
            this.position.y < this.radius;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            this.velocity.x = -this.velocity.x;
        }

        if (collidesWithBottomEdge || collidesWithTopEdge) {
            this.velocity.y = -this.velocity.y;
        }
    };
};

