import { Ball } from './ball';
import { Brick, createBricks } from './brick';
import { Paddle } from './paddle';
import { GameCanvas } from './gameCanvas';
import { ScoreBoard } from './scoreBoard';
import './style.css'
import {
    ARROW_LEFT,
    ARROW_RIGHT,
    BACKGROUND_COLOUR,
    PADDLE_VELOCITY_X,
    RADIUS,
    TEXT_COLOR
} from './constants';
import { state } from './state';
import { detectCollisions } from './detectCollisions';

const gameCanvas = new GameCanvas('#game-canvas');
const scoreBoard = new ScoreBoard('#score-board');

const scoreBoardBall = new Ball(
    { x: 20, y: scoreBoard.height * 0.5 },
    { radius: RADIUS }
);

const initialPaddlePosition = { x: (gameCanvas.width / 2) - 14, y: gameCanvas.height - 10 };
const paddle = new Paddle(initialPaddlePosition);

const ball = new Ball(
    {
        x: initialPaddlePosition.x + RADIUS + 1,
        y: initialPaddlePosition.y - RADIUS - 1
    },
    { radius: RADIUS },
    { x: 0, y: 0 },
);
const bricks = createBricks(gameCanvas.context, gameCanvas.width);

state.components = [paddle, ball, ...bricks];

const currentBall = () => state.components.filter(
    (component): component is Ball => component instanceof Ball
)[0];
const currentBricks = () => state.components.filter(
    (component): component is Brick => component instanceof Brick
);

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
    scoreBoardBall.draw(scoreBoard.context);
    scoreBoard.context.fillText(state.ballsRemaining.toString(), 40, scoreBoard.height * 0.8);
    scoreBoard.context.fillText(state.score.toString(), scoreBoard.width - 100, scoreBoard.height * 0.8);

    state.components.forEach((component) => {
        detectCollisions(
            component,
            state.components,
            paddle,
            currentBricks(),
            gameCanvas,
        );
        component.draw(gameCanvas.context);

        if ('move' in component) {
            component.move();
        }
    });

    if (currentBricks().length === 0) {
        const paddlePosition = paddle.position;
        const ball = currentBall();

        state.components.push(...bricks);
        state.ballsRemaining++;
        ball.position = {
            x: paddlePosition.x + RADIUS + 1,
            y: paddlePosition.y - RADIUS - 1
        };
        ball.canMove = false;
    }
};

// keep track of pressed keys to avoid stopping
// the paddle when both keys are pressed and one is released
const pressedKeys = new Set<string>();

const handleKeyDown = (event: KeyboardEvent) => {
    const ball = currentBall();
    let x = 0;
    if (event.key === ARROW_LEFT) {
        if (!ball.canMove) {
            ball.canMove = true;

            if (ball.velocity.x === 0 && ball.velocity.y === 0) {
                ball.velocity = { x: -state.ballSpeed, y: -state.ballSpeed };
            }
            ball.velocity = {
                x: ball.velocity.x > 0 ? -ball.velocity.x : ball.velocity.x,
                y: -ball.velocity.y
            };
        }

        x = -PADDLE_VELOCITY_X;
        leftButton.setAttribute('class', `${leftButton.className} pressed`);
    } else if (event.key === ARROW_RIGHT) {
        if (!ball.canMove) {
            ball.canMove = true;

            if (ball.velocity.x === 0 && ball.velocity.y === 0) {
                ball.velocity = { x: -state.ballSpeed, y: -state.ballSpeed };
            }
            ball.velocity = {
                x: ball.velocity.x < 0 ? -ball.velocity.x : ball.velocity.x,
                y: -ball.velocity.y
            };
        }

        x = PADDLE_VELOCITY_X;
        rightButton.setAttribute('class', `${rightButton.className} pressed`);
    }

    paddle.velocity = { x, y: 0 };
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

        paddle.velocity = { x, y: 0 };
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

