import { Ball } from "./ball";
import { Brick } from "./brick";
import { isMobile } from "./isMobile";
import { Paddle } from "./paddle";

type State = {
    components: (Ball | Paddle | Brick)[],
    ballSpeed: number,
    score: number,
    ballsRemaining: number,
};

export const state: State = {
    components: [],
    ballSpeed: isMobile() ? 9 : 5,
    score: 0,
    ballsRemaining: 3,
};

