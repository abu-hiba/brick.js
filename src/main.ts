import { Ball } from './ball';
import './style.css'

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
    const radius = getRand(10, 40);

    const initialPosition = {
        x: getRand(radius, canvas.width),
        y: getRand(radius, canvas.height),
    };

    const velocity = {
        x: getRand(1, 10),
        y: getRand(1, 10),
    };

    return new Ball(
        canvas,
        initialPosition,
        radius,
        velocity,
    );
};

const balls = [createRandomBall()];

const loop = () => {
    requestAnimationFrame(loop);

    context.fillStyle = 'white';
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach((ball) => {
        ball.draw();
        ball.move();
    });
};

loop();

const addButton = document.createElement('button');
addButton.textContent = 'Add ball';
addButton.addEventListener('click', () => {
    balls.push(createRandomBall());
});

const removeButton = document.createElement('button');
removeButton.textContent = 'Remove ball';
removeButton.addEventListener('click', () => {
    balls.pop();
});

const root = document.querySelector('#app');
if (!root) throw new Error('App root not found');
root.appendChild(addButton);
root.appendChild(removeButton);

