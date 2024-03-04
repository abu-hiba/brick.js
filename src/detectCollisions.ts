import { Ball } from "./ball";
import { Brick } from "./brick";
import { Paddle } from "./paddle";
import { GameCanvas } from "./gameCanvas";
import { RADIUS } from './constants';
import { state } from "./state";

export const detectCollisions = (
    component: Ball | Paddle | Brick,
    components: (Ball | Paddle | Brick)[],
    paddle: Paddle,
    currentBricks: Brick[],
    gameCanvas: GameCanvas,
) => {
    if (component instanceof Ball) {
        const ball = component;
        const ballPosition = ball.position;
        const ballRadius = ball.dimensions.radius;
        const ballVelocity = ball.velocity;

        const paddlePosition = paddle.position;
        const { width: paddleWidth, height: paddleHeight } = paddle.dimensions;

        const collidesWithPaddle =
            ballPosition.x + ballRadius > paddlePosition.x &&
            ballPosition.x - ballRadius < paddlePosition.x + paddleWidth &&
            ballPosition.y + ballRadius > paddlePosition.y &&
            ballPosition.y - ballRadius < paddlePosition.y + paddleHeight;

        currentBricks.forEach((brick) => {
            const brickPosition = brick.position;
            const { width: brickWidth, height: brickHeight } = brick.dimensions;

            const collidesWithBrick =
                ballPosition.x + ballRadius > brickPosition.x &&
                ballPosition.x - ballRadius < brickPosition.x + brickWidth &&
                ballPosition.y + ballRadius > brickPosition.y &&
                ballPosition.y - ballRadius < brickPosition.y + brickHeight;

            if (collidesWithBrick) {
                components.splice(components.indexOf(brick), 1);
                state.score += brick.points;

                ball.velocity = { x: ballVelocity.x * 1.02, y: -ballVelocity.y * 1.02 };
            }
        });

        const collidesWithRightEdge = ballPosition.x > gameCanvas.width - ballRadius;
        const collidesWithLeftEdge = ballPosition.x < ballRadius;
        const collidesWithTopEdge = ballPosition.y < ballRadius;
        const collidesWithBottomEdge = ballPosition.y > gameCanvas.height - ballRadius;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            ball.velocity = { x: -ballVelocity.x, y: ballVelocity.y };
        }

        if (collidesWithPaddle || collidesWithTopEdge) {
            ball.velocity = { x: ballVelocity.x, y: -ballVelocity.y };
            return;
        }

        if (collidesWithBottomEdge) {
            state.ballsRemaining--;
            if (state.ballsRemaining === 0) {
                components.splice(components.indexOf(ball), 1);
            } else {
                ball.position = {
                    x: paddlePosition.x + RADIUS + 1,
                    y: paddlePosition.y - RADIUS - 1
                };
                ball.canMove = false;
            }
        }
    } else if (component instanceof Paddle) {
        const paddle = component;
        const paddlePosition = paddle.position;
        const paddleWidth = paddle.dimensions.width;
        const paddleVelocity = paddle.velocity;

        const collidesWithRightEdge =
            paddlePosition.x + paddleVelocity.x > gameCanvas.width - paddleWidth;
        const collidesWithLeftEdge = paddlePosition.x + paddleVelocity.x < 0;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            paddle.canMove = false;
        }
    }
};

