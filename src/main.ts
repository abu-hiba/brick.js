import { Ball } from './ball';
import { Brick } from './brick';
import { MovableCanvasEntity } from './canvasEntity';
import { Paddle } from './paddle';
import './style.css'

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

const BACKGROUND_COLOUR = '#7AA2F7';
const TEXT_COLOR = '#FFFFFF';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
if (!canvas) {
    throw new Error('Canvas element not available');
}
const resolution = window.screen.availWidth / window.screen.availHeight;
canvas.width = 1000;
canvas.height = canvas.width / resolution;

const context = canvas.getContext('2d');
if (!context) {
    throw new Error('Cannot get canvas context');
}

const scoreBoard = document.querySelector<HTMLCanvasElement>('#score-board');
if (!scoreBoard) {
    throw new Error('Score board element not available');
}
scoreBoard.width = 1000;
scoreBoard.height = 60;

const scoreBoardContext = scoreBoard.getContext('2d');
if (!scoreBoardContext) {
    throw new Error('Cannot get score board context');
}

const radius = 9;

const scoreBoardBall = new Ball(scoreBoardContext, { x: 20, y: scoreBoard.height * 0.5 }, { radius });

let isBallMoving = false;
const initialNumberOfBalls = 3;

const initialPaddlePosition = { x: (canvas.width / 2) - 14, y: canvas.height - 10 };
const paddle = new Paddle(context, initialPaddlePosition);
const paddlePosition = paddle.getPosition();

const createBall = () => {
    return new Ball(
        context,
        {
            x: paddlePosition.x + radius + 1,
            y: paddlePosition.y - radius - 1
        },
        { radius },
        { x: 0, y: 0 }
    );
};

const createRowOfBricks = (
    rowNum: number,
    colour: string,
    points: number,
    height: number = 20,
    bricksPerRow: number = 8,
) => {
    const bricks: Brick[] = [];
    const brickWidth = canvas.width / bricksPerRow / 1.05;

    for (let i = 0; i < bricksPerRow; i++) {
        const brick = new Brick(
            context,
            { x: (i * brickWidth) * 1.05 + 1.05, y: rowNum * height * 1.6 + 1.6 },
            { width: brickWidth, height },
            colour,
            points,
        );
        bricks.push(brick);
    }

    return bricks;
};

const createBricks = () => {
    const colours = ['#9ECE6A', '#E0AF68', '#F7768E', '#7DCFFF'];
    const bricks: Brick[] = [];

    for (let i = 0; i < colours.length; i++) {
        const colour = colours[i];
        const row = createRowOfBricks(i, colour, colours.length - i);
        bricks.push(...row);
    }

    return bricks;
};

const balls = Array.from({ length: initialNumberOfBalls }, createBall);
const bricks = createBricks();
let score = 0;

const components: (Ball | Paddle | Brick)[] = [paddle, balls[balls.length - 1], ...bricks];
const paddleVelocityX = 10;

const detectCollisions = (component: Ball | Paddle | Brick) => {
    if (component instanceof Ball) {
        const ball = component;
        const ballPosition = ball.getPosition();
        const ballRadius = ball.getDimensions().radius;
        const ballVelocity = ball.getVelocity();

        const paddlePosition = paddle.getPosition();
        const { width: paddleWidth, height: paddleHeight } = paddle.getDimensions();

        const collidesWithPaddle =
            ballPosition.x + ballRadius > paddlePosition.x &&
            ballPosition.x - ballRadius < paddlePosition.x + paddleWidth &&
            ballPosition.y + ballRadius > paddlePosition.y &&
            ballPosition.y - ballRadius < paddlePosition.y + paddleHeight;

        bricks.forEach((brick) => {
            const brickPosition = brick.getPosition();
            const { width: brickWidth, height: brickHeight } = brick.getDimensions();

            const collidesWithBrick =
                ballPosition.x + ballRadius > brickPosition.x &&
                ballPosition.x - ballRadius < brickPosition.x + brickWidth &&
                ballPosition.y + ballRadius > brickPosition.y &&
                ballPosition.y - ballRadius < brickPosition.y + brickHeight;

            if (collidesWithBrick) {
                components.splice(components.indexOf(brick), 1);
                bricks.splice(bricks.indexOf(brick), 1);
                score += brick.points;

                ball.setVelocity({ x: ballVelocity.x, y: -ballVelocity.y });
            }
        });

        const collidesWithRightEdge = ballPosition.x > canvas.width - ballRadius;
        const collidesWithLeftEdge = ballPosition.x < ballRadius;
        const collidesWithTopEdge = ballPosition.y < ballRadius;
        const collidesWithBottomEdge = ballPosition.y > canvas.height - ballRadius;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            ball.setVelocity({ x: -ballVelocity.x, y: ballVelocity.y });
        }

        if (collidesWithPaddle || collidesWithTopEdge) {
            ball.setVelocity({ x: ballVelocity.x, y: -ballVelocity.y });
        }

        if (collidesWithBottomEdge) {
            components.splice(components.indexOf(ball), 1);
            balls.pop();
            balls[balls.length - 1].setPosition({
                x: paddlePosition.x + radius + 1,
                y: paddlePosition.y - radius - 1
            });
            components.push(balls[balls.length - 1]);
            isBallMoving = false;
        }
    } else if (component instanceof Paddle) {
        const paddle = component;
        const paddlePosition = paddle.getPosition();
        const paddleWidth = paddle.getDimensions().width;
        const paddleVelocity = paddle.getVelocity();

        const collidesWithRightEdge =
            paddlePosition.x + paddleVelocity.x > canvas.width - paddleWidth;
        const collidesWithLeftEdge = paddlePosition.x + paddleVelocity.x < 0;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            paddle.setCanMove(false);
        }
    }
};

const loop = () => {
    requestAnimationFrame(loop);

    if (balls.length === 0) {
        return;
    }

    context.fillStyle = BACKGROUND_COLOUR;
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);

    scoreBoardContext.fillStyle = BACKGROUND_COLOUR;
    scoreBoardContext.beginPath();
    scoreBoardContext.fillRect(0, 0, scoreBoard.width, scoreBoard.height);
    scoreBoardContext.fillStyle = TEXT_COLOR;
    scoreBoardContext.font = `${scoreBoard.height * 0.8}px sans-serif`;
    scoreBoardBall.draw();
    scoreBoardContext.fillText(balls.length.toString(), 40, scoreBoard.height * 0.8);
    scoreBoardContext.fillText(score.toString(), scoreBoard.width - 100, scoreBoard.height * 0.8);

    components.forEach((component) => {
        detectCollisions(component);
        component.draw();

        if (component instanceof MovableCanvasEntity) {
            component.move();
        }
    });
};

// keep track of pressed keys to avoid stopping
// the paddle when both keys are pressed and one is released
const pressedKeys = new Set<string>();

const handleKeyDown = (event: KeyboardEvent) => {
    let x = 0;
    if (event.key === ARROW_LEFT) {
        if (isBallMoving === false) {
            isBallMoving = true;
            balls[balls.length - 1].setVelocity({ x: -5, y: -5 });
        }

        x = -paddleVelocityX;
        leftButton.setAttribute('class', `${leftButton.className} pressed`);
    } else if (event.key === ARROW_RIGHT) {
        if (isBallMoving === false) {
            isBallMoving = true;
            balls[balls.length - 1].setVelocity({ x: 5, y: -5 });
        }

        x = paddleVelocityX;
        rightButton.setAttribute('class', `${rightButton.className} pressed`);
    }

    paddle.setVelocity({ x, y: 0 });
    pressedKeys.add(event.key);
};

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === ARROW_LEFT || event.key === ARROW_RIGHT) {
        if (event.key === ARROW_LEFT) {
            leftButton.setAttribute('class', `${leftButton.className.replace(' pressed', '')}`);
        }
        if (event.key === ARROW_RIGHT) {
            rightButton.setAttribute('class', `${rightButton.className.replace(' pressed', '')}`);
        }

        pressedKeys.delete(event.key);

        let x = 0;
        if (pressedKeys.has(ARROW_LEFT)) {
            x = -paddleVelocityX;
        } else if (pressedKeys.has(ARROW_RIGHT)) {
            x = paddleVelocityX;
        }

        paddle.setVelocity({ x, y: 0 });
    }
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

type Direction = typeof ARROW_LEFT | typeof ARROW_RIGHT;
const handleButtonDown = (direction: Direction) => (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    document.dispatchEvent(new KeyboardEvent('keydown', { 'key': direction }));
};

const handleButtonUp = (direction: Direction) => (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    document.dispatchEvent(new KeyboardEvent('keyup', { 'key': direction }));
};

const leftButton = document.createElement('div');
leftButton.setAttribute('class', 'arrow-key left');
leftButton.textContent = '\u25C4';
leftButton.addEventListener('touchstart', handleButtonDown(ARROW_LEFT));
leftButton.addEventListener('mousedown', handleButtonDown(ARROW_LEFT));
leftButton.addEventListener('touchend', handleButtonUp(ARROW_LEFT));
leftButton.addEventListener('mouseup', handleButtonUp(ARROW_LEFT));

const rightButton = document.createElement('div');
rightButton.setAttribute('class', 'arrow-key right');
rightButton.textContent = '\u25BA';
rightButton.addEventListener('touchstart', handleButtonDown(ARROW_RIGHT));
rightButton.addEventListener('mousedown', handleButtonDown(ARROW_RIGHT));
rightButton.addEventListener('touchend', handleButtonUp(ARROW_RIGHT));
rightButton.addEventListener('mouseup', handleButtonUp(ARROW_RIGHT));

const app = document.querySelector('#app');
if (!app) throw new Error('App root not found');
app.appendChild(leftButton);
app.appendChild(rightButton);

loop();

