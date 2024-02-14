import { Ball } from './ball';
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

const balls = Array.from({ length: initialNumberOfBalls }, createBall);

const components: (Ball | Paddle)[] = [paddle, balls.at(-1)];
const paddleVelocityX = 5;

const detectCollisions = (component: Ball | Paddle) => {
    if (component instanceof Ball) {
        const ball = component;
        const ballPosition = ball.getPosition();
        const ballRadius = ball.getDimensions().radius;
        const ballVelocity = ball.getVelocity();

        const paddlePosition = paddle.getPosition();
        const { width: paddleWidth, height: paddleHeight } = paddle.getDimensions();

        const collidesWithPaddle =
            ballPosition.x + ballRadius > paddlePosition.x &&
            ballPosition.x + ballRadius < paddlePosition.x + paddleWidth &&
            ballPosition.y + ballRadius > paddlePosition.y &&
            ballPosition.y + ballRadius < paddlePosition.y + paddleHeight;

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
            balls.at(-1).setPosition({
                x: paddlePosition.x + radius + 1,
                y: paddlePosition.y - radius - 1
            });
            components.push(balls.at(-1));
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
        component.move();
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
            balls.at(-1).setVelocity({ x: -2, y: -2 });
        }

        x = -paddleVelocityX;
        leftButton.setAttribute('class', 'arrow-key pressed');
    } else if (event.key === ARROW_RIGHT) {
        if (isBallMoving === false) {
            isBallMoving = true;
            balls.at(-1).setVelocity({ x: 2, y: -2 });
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

loop();

type Direction = typeof ARROW_LEFT | typeof ARROW_RIGHT;
const handleButtonDown = (direction: Direction) => (_event: MouseEvent | TouchEvent) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { 'key': direction }));
};

const handleButtonUp = (direction: Direction) => (_event: MouseEvent | TouchEvent) => {
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

