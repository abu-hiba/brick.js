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

const getRand = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

const createRandomBall = () => {
    const radius = getRand(3, 3);

    const initialPosition = {
        x: getRand(radius, canvas.width - radius),
        y: getRand(radius, canvas.height - radius),
    };

    const velocity = {
        x: getRand(1, 1),
        y: getRand(1, 1),
    };

    return new Ball(
        canvas,
        initialPosition,
        radius,
        velocity,
    );
};

const paddle = new Paddle(canvas, { x: (canvas.width / 2) - 14, y: canvas.height - 10 })
const components: (Ball | Paddle)[] = [paddle];
const paddleVelocityX = 5;

const detectCollisions = (component: Ball | Paddle) => {
    if (component instanceof Ball) {
        const ball = component;
        const ballPosition = ball.getPosition();
        const ballRadius = ball.getRadius();
        const ballVelocity = ball.getVelocity();

        const paddlePosition = paddle.getPosition();
        const paddleWidth = paddle.getWidth();
        const paddleHeight = paddle.getHeight();

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
        }
    } else if (component instanceof Paddle) {
        const paddle = component;
        const paddlePosition = paddle.getPosition();
        const paddleWidth = paddle.getWidth();
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

    components.forEach((component) => {
        detectCollisions(component);
        component.draw();
        component.move();
    });
};

// keep track of pressed keys to avoid stopping
// the paddle when both keys are pressed and one is released
const pressedKeys = new Set<string>();

document.addEventListener('keydown', (event) => {
    let x = 0;
    if (event.key === ARROW_LEFT) {
        x = -paddleVelocityX;
    } else if (event.key === ARROW_RIGHT) {
        x = paddleVelocityX;
    }

    paddle.setVelocity({ x, y: 0 });
    pressedKeys.add(event.key);
});

document.addEventListener('keyup', (event) => {
    if (event.key === ARROW_LEFT || event.key === ARROW_RIGHT) {
        pressedKeys.delete(event.key);

        let x = 0;
        if (pressedKeys.has(ARROW_LEFT)) {
            x = -paddleVelocityX;
        } else if (pressedKeys.has(ARROW_RIGHT)) {
            x = paddleVelocityX;
        }

        paddle.setVelocity({ x, y: 0 });
    }
});

loop();

const addButton = document.createElement('button');
addButton.textContent = 'Add ball';
addButton.addEventListener('click', () => {
    components.push(createRandomBall());
});

const removeButton = document.createElement('button');
removeButton.textContent = 'Remove ball';
removeButton.addEventListener('click', () => {
    components.pop();
});

const root = document.querySelector('#buttons');
if (!root) throw new Error('App root not found');
root.appendChild(addButton);
root.appendChild(removeButton);

