// src/Game.js
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { setupMatter, cleanupMatter } from './PlayArea';
import { applyClockworkForces } from './ClockworkFlow';
import { applyRandomForces } from './Wiggle';
import { applyFlagellaForce } from './Flagella';
import { createCells } from './Cell';
import { setupJawCollision } from './Jaw';

const Game = () => {
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const engineRef = useRef(Matter.Engine.create());
    const sceneRef = useRef(null);
    const renderRef = useRef(null);
    const tickCounterRef = useRef(0);
    const bodyPartIndexRef = useRef(0);

    const animate = (time) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = 16.667; // Fixed time step of 16.667 ms (60 FPS)

            // Update Matter.js engine
            Matter.Engine.update(engineRef.current, deltaTime);

            Update(engineRef, tickCounterRef, bodyPartIndexRef);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const { render, runner } = setupMatter(sceneRef, engineRef);
        renderRef.current = render;

        // Create cells and add them to the world
        const cells = createCells(30, engineRef.current);
        Matter.World.add(engineRef.current.world, cells);

        // Set up jaw collision handling
        setupJawCollision(engineRef.current);

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(requestRef.current);
            cleanupMatter(renderRef.current, engineRef);
        };
    }, []);

    return <div ref={sceneRef} style={{ width: '1000px', height: '1000px' }} />;
};

function Update(engineRef, tickCounterRef, bodyPartIndexRef) {
    // Increment the tick counter
    tickCounterRef.current += 1;

    // Activate applyClockworkForces once every 6 ticks
    if (tickCounterRef.current >= 6) {  // I will lower this after movement parts are added.
        applyClockworkForces(engineRef);
        tickCounterRef.current = 0; // Reset the counter
    }

    // Apply random forces to cells
    applyRandomForces(engineRef);

    // Get all cell composites from the engine
    const cells = Matter.Composite.allComposites(engineRef.current.world).filter(composite => composite.bodies[0].label === 'cell');

    // Define the order of body parts
    const bodyPartsOrder = ['top', 'right', 'bottom', 'left'];

    // Get the current body part to update
    const currentBodyPart = bodyPartsOrder[bodyPartIndexRef.current % bodyPartsOrder.length];

    // Update the body part for each cell
    cells.forEach(cell => {
        const bodyPart = cell.bodies[0].bodyParts[currentBodyPart];
        if (bodyPart === 'Flagella') {
            applyFlagellaForce(cell, currentBodyPart);
        }
    });

    // Increment the body part index
    bodyPartIndexRef.current += 1;
}

export default Game;

