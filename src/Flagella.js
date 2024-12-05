// src/Flagella.js
import Matter from 'matter-js';

export const applyFlagellaForce = (cell, direction) => {
    const forceMagnitude = 0.0001; // Adjust the force magnitude as needed
    let force = { x: 0, y: 0 };

    switch (direction) {
        case 'top':
            force = { x: 0, y: forceMagnitude };
            break;
        case 'right':
            force = { x: -forceMagnitude, y: 0 };
            break;
        case 'bottom':
            force = { x: 0, y: -forceMagnitude };
            break;
        case 'left':
            force = { x: forceMagnitude, y: 0 };
            break;
        default:
            break;
    }

    Matter.Body.applyForce(cell.bodies[0], cell.bodies[0].position, force);
};
