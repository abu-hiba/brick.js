export class ScoreBoard {
    private scoreBoard: HTMLCanvasElement;
    readonly width: number;
    readonly height: number;
    readonly context: CanvasRenderingContext2D;

    constructor(selector: string) {
        const scoreBoard = document.querySelector<HTMLCanvasElement>(selector);
        if (!scoreBoard) {
            throw new Error('Score board element not available');
        }
        this.scoreBoard = scoreBoard;

        this.width = 1000;
        this.height = 60;

        this.scoreBoard.width = this.width;
        this.scoreBoard.height = this.height;

        const scoreBoardContext = scoreBoard.getContext('2d');
        if (!scoreBoardContext) {
            throw new Error('Cannot get score board context');
        }
        this.context = scoreBoardContext;
    }
};

