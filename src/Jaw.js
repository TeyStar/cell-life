// src/Jaw.js
import Matter from 'matter-js';

export const applyJawAction = (cellComposite) => {
    // Define the action for the Jaw body part
    // Check for collisions with cells of other teams
    const jawBody = cellComposite.bodies.find(body => body.label === 'jaw');

    if (!jawBody) return;

    Matter.Events.on(jawBody, 'collisionStart', event => {
        console.Log('Jaw collision detected');
        event.pairs.forEach(pair => {
            const otherBody = pair.bodyA === jawBody ? pair.bodyB : pair.bodyA;

            if (otherBody.label === 'cell' && otherBody.team !== cellComposite.bodies[0].team && !cellComposite.bodies[0].isFed && otherBody.isAlive) {
                otherBody.isAlive = false;
                cellComposite.bodies[0].isFed = true;
                otherBody.render.fillStyle = getGrayShade(otherBody.render.fillStyle); // Update the color of the other cell
            }
        });
    });
};

const getGrayShade = (color) => {
    const shadeFactor = 1; // Adjust this factor to control the shade of gray
    const rgb = color.match(/\d+/g).map(Number);
    const gray = rgb.map(value => Math.floor(value * shadeFactor));
    return `rgb(${gray.join(',')})`;
};

