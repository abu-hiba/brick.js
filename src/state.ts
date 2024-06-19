import { Ball } from "./ball";
import { Brick } from "./brick";
import { isMobile } from "./isMobile";
import { Paddle } from "./paddle";

type State = {
    components: (Ball | Paddle | Brick)[],
    ballSpeed: number,
    score: number,
    ballsRemaining: number,
    currentBall: () => Ball,
    currentBricks: () => Brick[],
};

export const currentBall = () => state.components.filter(
    (component): component is Ball => component instanceof Ball
)[0];

export const currentBricks = () => state.components.filter(
    (component): component is Brick => component instanceof Brick
);

export const state: State = {
    components: [],
    ballSpeed: isMobile() ? 9 : 5,
    score: 0,
    ballsRemaining: 3,
    currentBall,
    currentBricks,
};

