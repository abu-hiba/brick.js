import { Ball } from './ball';
import { Brick, createBricks } from './brick';
import { MovableCanvasEntity } from './canvasEntity';
import { Paddle } from './paddle';
import { GameCanvas } from './gameCanvas';
import { ScoreBoard } from './scoreBoard';
import './style.css'

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const BACKGROUND_COLOUR = '#7AA2F7';
const TEXT_COLOR = '#FFFFFF';
const RADIUS = 9;
const INITIAL_BALL_COUNT = 3;
const PADDLE_VELOCITY_X = 10;

const gameCanvas = new GameCanvas();
const scoreBoard = new ScoreBoard();

const scoreBoardBall = new Ball(
    scoreBoard.context,
    { x: 20, y: scoreBoard.height * 0.5 },
    { radius: RADIUS }
);

const initialPaddlePosition = { x: (gameCanvas.width / 2) - 14, y: gameCanvas.height - 10 };
const paddle = new Paddle(gameCanvas.context, initialPaddlePosition);

// State
let canBallMove = false;
let ballSpeed = 5;
let score = 0;
let ballsRemaining = INITIAL_BALL_COUNT;

const ball = new Ball(
    gameCanvas.context,
    {
        x: initialPaddlePosition.x + RADIUS + 1,
        y: initialPaddlePosition.y - RADIUS - 1
    },
    { radius: RADIUS },
    { x: 0, y: 0 },
);
const bricks = createBricks(gameCanvas.context, gameCanvas.width);

const components: (Ball | Paddle | Brick)[] = [paddle, ball, ...bricks];

const currentBall = () => components.filter((component): component is Ball => component instanceof Ball)[0];
const currentBricks = () => components.filter((component): component is Brick => component instanceof Brick);

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

        currentBricks().forEach((brick) => {
            const brickPosition = brick.getPosition();
            const { width: brickWidth, height: brickHeight } = brick.getDimensions();

            const collidesWithBrick =
                ballPosition.x + ballRadius > brickPosition.x &&
                ballPosition.x - ballRadius < brickPosition.x + brickWidth &&
                ballPosition.y + ballRadius > brickPosition.y &&
                ballPosition.y - ballRadius < brickPosition.y + brickHeight;

            if (collidesWithBrick) {
                components.splice(components.indexOf(brick), 1);
                score += brick.points;

                ball.setVelocity({ x: ballVelocity.x, y: -ballVelocity.y });
            }
        });

        const collidesWithRightEdge = ballPosition.x > gameCanvas.width - ballRadius;
        const collidesWithLeftEdge = ballPosition.x < ballRadius;
        const collidesWithTopEdge = ballPosition.y < ballRadius;
        const collidesWithBottomEdge = ballPosition.y > gameCanvas.height - ballRadius;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            ball.setVelocity({ x: -ballVelocity.x, y: ballVelocity.y });
        }

        if (collidesWithPaddle || collidesWithTopEdge) {
            ball.setVelocity({ x: ballVelocity.x, y: -ballVelocity.y });
        }

        if (collidesWithBottomEdge) {
            ballsRemaining--;
            if (ballsRemaining === 0) {
                components.splice(components.indexOf(ball), 1);
            } else {
                ball.setVelocity({ x: 0, y: 0 });
                ball.setPosition({
                    x: paddlePosition.x + RADIUS + 1,
                    y: paddlePosition.y - RADIUS - 1
                });
                canBallMove = false;
            }
        }
    } else if (component instanceof Paddle) {
        const paddle = component;
        const paddlePosition = paddle.getPosition();
        const paddleWidth = paddle.getDimensions().width;
        const paddleVelocity = paddle.getVelocity();

        const collidesWithRightEdge =
            paddlePosition.x + paddleVelocity.x > gameCanvas.width - paddleWidth;
        const collidesWithLeftEdge = paddlePosition.x + paddleVelocity.x < 0;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            paddle.setCanMove(false);
        }
    }
};

const loop = () => {
    requestAnimationFrame(loop);

    gameCanvas.context.fillStyle = BACKGROUND_COLOUR;
    gameCanvas.context.beginPath();
    gameCanvas.context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    scoreBoard.context.fillStyle = BACKGROUND_COLOUR;
    scoreBoard.context.beginPath();
    scoreBoard.context.fillRect(0, 0, scoreBoard.width, scoreBoard.height);
    scoreBoard.context.fillStyle = TEXT_COLOR;
    scoreBoard.context.font = `${scoreBoard.height * 0.8}px sans-serif`;
    scoreBoardBall.draw();
    scoreBoard.context.fillText(ballsRemaining.toString(), 40, scoreBoard.height * 0.8);
    scoreBoard.context.fillText(score.toString(), scoreBoard.width - 100, scoreBoard.height * 0.8);

    components.forEach((component) => {
        detectCollisions(component);
        component.draw();

        if (component instanceof MovableCanvasEntity) {
            component.move();
        }
    });

    if (currentBricks().length === 0) {
        const paddlePosition = paddle.getPosition();
        const ball = currentBall();

        components.push(...bricks);
        ballsRemaining++;
        ball.setPosition({
            x: paddlePosition.x + RADIUS + 1,
            y: paddlePosition.y - RADIUS - 1
        });
        ball.setVelocity({ x: 0, y: 0 });
        ballSpeed += 2;
        canBallMove = false;
    }
};

// keep track of pressed keys to avoid stopping
// the paddle when both keys are pressed and one is released
const pressedKeys = new Set<string>();

const handleKeyDown = (event: KeyboardEvent) => {
    const ball = currentBall();
    let x = 0;
    if (event.key === ARROW_LEFT) {
        if (canBallMove === false) {
            canBallMove = true;
            ball.setVelocity({ x: -ballSpeed, y: -ballSpeed });
        }

        x = -PADDLE_VELOCITY_X;
        leftButton.setAttribute('class', `${leftButton.className} pressed`);
    } else if (event.key === ARROW_RIGHT) {
        if (canBallMove === false) {
            canBallMove = true;
            ball.setVelocity({ x: ballSpeed, y: -ballSpeed });
        }

        x = PADDLE_VELOCITY_X;
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
            x = -PADDLE_VELOCITY_X;
        } else if (pressedKeys.has(ARROW_RIGHT)) {
            x = PADDLE_VELOCITY_X;
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

