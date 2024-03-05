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

        const collidesWithPaddle =
            ball.position.x + ball.dimensions.radius > paddle.position.x &&
            ball.position.x - ball.dimensions.radius < paddle.position.x + paddle.dimensions.width &&
            ball.position.y + ball.dimensions.radius > paddle.position.y &&
            ball.position.y - ball.dimensions.radius < paddle.position.y + paddle.dimensions.height;

        currentBricks.forEach((brick) => {
            const collidesWithBrick =
                ball.position.x + ball.dimensions.radius > brick.position.x &&
                ball.position.x - ball.dimensions.radius < brick.position.x + brick.dimensions.width &&
                ball.position.y + ball.dimensions.radius > brick.position.y &&
                ball.position.y - ball.dimensions.radius < brick.position.y + brick.dimensions.height;

            if (collidesWithBrick) {
                components.splice(components.indexOf(brick), 1);
                state.score += brick.points;
                const velocityMultiplier = 1.02;

                const collidesWithBrickSide =
                    ball.position.x > brick.position.x + brick.dimensions.width ||
                    ball.position.x < brick.position.x
                const collidesWithBrickTopOrBottom =
                    ball.position.y > brick.position.y + brick.dimensions.height ||
                    ball.position.y < brick.position.y

                if (collidesWithBrickSide && collidesWithBrickTopOrBottom) {
                    ball.velocity = {
                        x: -ball.velocity.x * velocityMultiplier,
                        y: -ball.velocity.y * velocityMultiplier
                    };
                } else if (collidesWithBrickSide) {
                    ball.velocity = {
                        x: -ball.velocity.x * velocityMultiplier,
                        y: ball.velocity.y * velocityMultiplier
                    };
                } else if (collidesWithBrickTopOrBottom) {
                    ball.velocity = {
                        x: ball.velocity.x * velocityMultiplier,
                        y: -ball.velocity.y * velocityMultiplier
                    };
                }
            }
        });

        const collidesWithRightEdge = ball.position.x > gameCanvas.width - ball.dimensions.radius;
        const collidesWithLeftEdge = ball.position.x < ball.dimensions.radius;
        const collidesWithTopEdge = ball.position.y < ball.dimensions.radius;
        const collidesWithBottomEdge = ball.position.y > gameCanvas.height - ball.dimensions.radius;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            ball.velocity = { x: -ball.velocity.x, y: ball.velocity.y };
        }

        if (collidesWithPaddle || collidesWithTopEdge) {
            ball.velocity = { x: ball.velocity.x, y: -ball.velocity.y };
            return;
        }

        if (collidesWithBottomEdge) {
            state.ballsRemaining--;
            if (state.ballsRemaining === 0) {
                components.splice(components.indexOf(ball), 1);
            } else {
                ball.position = {
                    x: paddle.position.x + RADIUS + 1,
                    y: paddle.position.y - RADIUS - 1
                };
                ball.canMove = false;
            }
        }
    } else if (component instanceof Paddle) {
        const paddleWidth = paddle.dimensions.width;
        const paddleVelocity = paddle.velocity;

        const collidesWithRightEdge =
            paddle.position.x + paddleVelocity.x > gameCanvas.width - paddleWidth;
        const collidesWithLeftEdge = paddle.position.x + paddleVelocity.x < 0;

        if (collidesWithRightEdge || collidesWithLeftEdge) {
            paddle.canMove = false;
        }
    }
};

