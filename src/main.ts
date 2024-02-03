import { Ball } from './ball';
import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
if (!canvas) {
    throw new Error("Canvas element not available"); 
}

const context = canvas.getContext('2d');
if (!context) {
    throw new Error("Cannot get canvas context");
}

const ball1 = new Ball(
    { x: 100, y: 100 },
    10,
);

ball1.draw(context);

