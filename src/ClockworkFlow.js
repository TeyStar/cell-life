// src/ClockworkFlow.js
import Matter from 'matter-js';

export const applyClockworkForces = (engineRef) => {
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
        if (!body.isStatic) {
            const { x, y } = body.position;
            const flowMagnitude = 0.00001;
            const gentleFlowStrength = flowMagnitude / 1;
            const strongFlowStrength = flowMagnitude * 1.5;

            if (x < 333 && y < 333) {
                // Top left section - gentle right, gentle up
                Matter.Body.applyForce(body, body.position, { x: strongFlowStrength, y: 0 });
            } else if (x >= 333 && x < 666 && y < 333) {
                // Top center section - strong right
                Matter.Body.applyForce(body, body.position, { x: gentleFlowStrength, y: 0 });
            } else if (x >= 666 && y < 333) {
                // Top right section - gentle right, gentle down
                Matter.Body.applyForce(body, body.position, { x: 0, y: strongFlowStrength });
            } else if (x < 333 && y >= 333 && y < 666) {
                // Middle left section - strong up
                Matter.Body.applyForce(body, body.position, { x: 0, y: -strongFlowStrength });
            } else if (x >= 333 && x < 666 && y >= 333 && y < 666) {
                // Center section - no force
                // No force applied
            } else if (x >= 666 && y >= 333 && y < 666) {
                // Middle right section - strong down
                Matter.Body.applyForce(body, body.position, { x: 0, y: strongFlowStrength });
            } else if (x < 333 && y >= 666) {
                // Bottom left section - gentle left, gentle up
                Matter.Body.applyForce(body, body.position, { x: 0, y: -strongFlowStrength });
            } else if (x >= 333 && x < 666 && y >= 666) {
                // Bottom center section - strong left
                Matter.Body.applyForce(body, body.position, { x: -gentleFlowStrength, y: 0 });
            } else if (x >= 666 && y >= 666) {
                // Bottom right section - gentle left, gentle down
                Matter.Body.applyForce(body, body.position, { x: -strongFlowStrength, y: 0 });
            }
        }
    });
};



