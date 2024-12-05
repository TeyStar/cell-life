// src/Jaw.js
import Matter from 'matter-js';

export const setupJawCollision = (engine) => {
    Matter.Events.on(engine, 'collisionStart', event => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            const jawBody = [bodyA, bodyB].find(body => body.label === 'jaw');
            const otherBody = jawBody === bodyA ? bodyB : bodyA;

            if (jawBody && otherBody) {
                const jawCell = jawBody.cell;
                if (jawCell.isAlive) {
                    if (otherBody.label != 'Rectangle Body') {
                        const otherCell = otherBody.label === 'cell' ? otherBody : otherBody.cell;

                        if (jawCell && otherCell.team !== jawCell.team && !jawCell.isFed && otherCell.isAlive) {
                            otherCell.isAlive = false;
                            jawCell.isFed = true;
                            otherCell.render.fillStyle = getGrayShade(otherBody.render.fillStyle); // Update the color of the other cell
                        }
                    }
                }
            }
        });
    });
};

const getGrayShade = (color) => {
    const namedColors = {
        red: 'rgb(128, 0, 0)',
        blue: 'rgb(0, 0, 128)',
        yellow: 'rgb(128, 128, 0)',
        purple: 'rgb(128, 0, 128)',
        green: 'rgb(0, 128, 0)',
        cyan: 'rgb(0, 128, 128)',
    };

    return namedColors[color.toLowerCase()] || 'rgb(128, 128, 128)'; // Default gray color if color is not found
};

