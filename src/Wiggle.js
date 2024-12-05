// src/Wiggle.js
import Matter from 'matter-js';

export const applyRandomForces = (engineRef) => {
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
        if (!body.isStatic) {
            const forceMagnitude = 0.00001;
            const randomForce = {
                x: (Math.random() - 0.5) * forceMagnitude,
                y: (Math.random() - 0.5) * forceMagnitude
            };
            Matter.Body.applyForce(body, body.position, randomForce);
        }
    });
};