import { Brick } from './Brick';

type CreateRowOfBricksParams = {
    rowIndex: number,
    colour: string,
    points: number,
    rowHeight: number,
    bricksPerRow: number,
    rowWidth: number,
    context: CanvasRenderingContext2D,
};

const createRowOfBricks = (params: CreateRowOfBricksParams) => {
    const bricks: Brick[] = [];
    const brickWidth = params.rowWidth / params.bricksPerRow / 1.05;

    for (let i = 0; i < params.bricksPerRow; i++) {
        const brick = new Brick(
            {
                x: (i * brickWidth) * 1.05 + 1.05,
                y: params.rowIndex * params.rowHeight * 1.6 + 1.6
            },
            {
                width: brickWidth,
                height: params.rowHeight
            },
            params.colour,
            params.points,
        );
        bricks.push(brick);
    }

    return bricks;
};

export const createBricks = (context: CanvasRenderingContext2D, rowWidth: number) => {
    // const colours = ['#9ECE6A', '#E0AF68', '#F7768E', '#7DCFFF'];
    const colours = ['#9ECE6A'];
    const bricks: Brick[] = [];

    for (let i = 0; i < colours.length; i++) {
        const colour = colours[i];
        const row = createRowOfBricks({
            rowIndex: i,
            colour,
            points: colours.length - i,
            rowHeight: 20,
            rowWidth,
            bricksPerRow: 8,
            context,
        });
        bricks.push(...row);
    }

    return bricks;
};

