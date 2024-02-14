import { Ball } from './ball';
import { Brick } from './brick';
import { MovableCanvasEntity } from './canvasEntity';
import { Paddle } from './paddle';
import './style.css'

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
if (!canvas) {
    throw new Error('Canvas element not available');
}

const context = canvas.getContext('2d');
if (!context) {
    throw new Error('Cannot get canvas context');
}

const scoreBoard = document.querySelector<HTMLCanvasElement>('#score-board');
if (!scoreBoard) {
    throw new Error('Score board element not available');
}
scoreBoard.setAttribute('height', '20');

const scoreBoardContext = scoreBoard.getContext('2d');
if (!scoreBoardContext) {
    throw new Error('Cannot get score board context');
}

const scoreBoardBall = new Ball(scoreBoardContext, { x: 10, y: 10 }, { radius: 3 });

let isBallMoving = false;
const initialNumberOfBalls = 3;

const radius = 3;

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

const createRowOfBricks = (rowNum: number, colour: string, height: number = 5, bricksPerRow: number = 8) => {
    const bricks: Brick[] = [];
    const brickWidth = canvas.width / bricksPerRow / 1.05;

    for (let i = 0; i < bricksPerRow; i++) {
        const brick = new Brick(
            context,
            { x: (i * brickWidth) * 1.05 + 1.05, y: rowNum * height * 1.6},
            { width: brickWidth, height },
            colour
        );
        bricks.push(brick);
    }

    return bricks;
};

const createBricks = () => {
    const colours = ['green', 'orange', 'red', 'cyan'];
    const bricks: Brick[] = [];

    for (let i = 0; i < colours.length; i++) {
        const colour = colours[i];
        const row = createRowOfBricks(i, colour);
        bricks.push(...row);
    }

    return bricks;
};

const balls = Array.from({ length: initialNumberOfBalls }, createBall);
const bricks = createBricks();

const components: (Ball | Paddle | Brick)[] = [paddle, balls[balls.length - 1], ...bricks];
const paddleVelocityX = 5;

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

    context.fillStyle = 'white';
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);

    scoreBoardContext.fillStyle = 'white';
    scoreBoardContext.beginPath();
    scoreBoardContext.fillRect(0, 0, scoreBoard.width, scoreBoard.height);
    scoreBoardContext.fillStyle = 'black';
    scoreBoardContext.font = '1rem sans-serif';
    scoreBoardBall.draw();
    scoreBoardContext.fillText(balls.length.toString(), 20, 15);

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
            balls[balls.length - 1].setVelocity({ x: -2, y: -2 });
        }

        x = -paddleVelocityX;
        leftButton.setAttribute('class', 'arrow-key pressed');
    } else if (event.key === ARROW_RIGHT) {
        if (isBallMoving === false) {
            isBallMoving = true;
            balls[balls.length - 1].setVelocity({ x: 2, y: -2 });
        }

        x = paddleVelocityX;
        rightButton.setAttribute('class', 'arrow-key pressed');
    }

    paddle.setVelocity({ x, y: 0 });
    pressedKeys.add(event.key);
};

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === ARROW_LEFT || event.key === ARROW_RIGHT) {
        if (event.key === ARROW_LEFT) {
            leftButton.setAttribute('class', 'arrow-key');
        }
        if (event.key === ARROW_RIGHT) {
            rightButton.setAttribute('class', 'arrow-key');
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

const controls = document.createElement('div');
controls.setAttribute('id', 'controls');

const leftButton = document.createElement('div');
leftButton.setAttribute('class', 'arrow-key');
leftButton.textContent = '⇦';
leftButton.addEventListener('touchstart', handleButtonDown(ARROW_LEFT));
leftButton.addEventListener('mousedown', handleButtonDown(ARROW_LEFT));
leftButton.addEventListener('touchend', handleButtonUp(ARROW_LEFT));
leftButton.addEventListener('mouseup', handleButtonUp(ARROW_LEFT));

const rightButton = document.createElement('div');
rightButton.setAttribute('class', 'arrow-key');
rightButton.textContent = '⇨';
rightButton.addEventListener('touchstart', handleButtonDown(ARROW_RIGHT));
rightButton.addEventListener('mousedown', handleButtonDown(ARROW_RIGHT));
rightButton.addEventListener('touchend', handleButtonUp(ARROW_RIGHT));
rightButton.addEventListener('mouseup', handleButtonUp(ARROW_RIGHT));

const app = document.querySelector('#app');
if (!app) throw new Error('App root not found');
app.appendChild(controls);
controls.appendChild(leftButton);
controls.appendChild(rightButton);

loop();

