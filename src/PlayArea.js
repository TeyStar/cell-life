// src/playArea.js
import Matter from 'matter-js';
import { createCells } from './Cell';

export const setupMatter = (sceneRef, engineRef) => {
    const render = Matter.Render.create({
        element: sceneRef.current,
        engine: engineRef.current,
        options: {
            width: 1000,
            height: 1000,
            wireframes: false
        }
    });

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engineRef.current);

    engineRef.current.world.gravity.y = 0.000005;

    // Create 30 cells
    const cells = createCells(30);

    const ground = Matter.Bodies.rectangle(500, 950, 1000, 100, { isStatic: true, friction: 0 });
    const lWall = Matter.Bodies.rectangle(50, 500, 100, 1000, { isStatic: true, friction: 0 });
    const rWall = Matter.Bodies.rectangle(950, 500, 100, 1000, { isStatic: true, friction: 0 });
    const lid = Matter.Bodies.rectangle(500, 50, 1000, 100, { isStatic: true, friction: 0 });;
    Matter.World.add(engineRef.current.world, [...cells, ground, lWall, rWall, lid]);

    return { render, runner };
};

export const cleanupMatter = (render, engineRef) => {
    Matter.Render.stop(render);
    Matter.World.clear(engineRef.current.world);
    Matter.Engine.clear(engineRef.current);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
};
