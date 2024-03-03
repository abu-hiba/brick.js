import { Ball } from "./ball";
import { Brick } from "./brick";
import { Paddle } from "./paddle";

type State = {
    components: (Ball | Paddle | Brick)[],
    canBallMove: boolean,
    ballSpeed: number,
    score: number,
    ballsRemaining: number,
};

export const state: State = {
    components: [],
    canBallMove: false,
    ballSpeed: 5,
    score: 0,
    ballsRemaining: 3,
};

