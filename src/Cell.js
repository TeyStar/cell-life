import Matter from 'matter-js';

const teams = [
    { color: 'red', name: 'Red' },
    { color: 'blue', name: 'Blue' },
    { color: 'yellow', name: 'Yellow' },
    { color: 'purple', name: 'Purple' },
    { color: 'green', name: 'Green' },
    { color: 'cyan', name: 'Cyan' }
];

const generateBodyConfiguration = () => {
    const getRandomBodyPart = () => {
        return Math.random() < 0.5 ? 'Flagella' : 'Jaw';
    };

    return {
        top: Math.random() < 0.25 ? getRandomBodyPart() : null,
        left: Math.random() < 0.25 ? getRandomBodyPart() : null,
        right: Math.random() < 0.25 ? getRandomBodyPart() : null,
        bottom: Math.random() < 0.25 ? getRandomBodyPart() : null
    };
};

const teamConfigurations = teams.reduce((acc, team) => {
    acc[team.name] = generateBodyConfiguration();
    return acc;
}, {});

export const createCells = (numCells) => {
    const cells = [];
    const numCellsPerTeam = 5;

    teams.forEach(team => {
        const config = teamConfigurations[team.name];

        for (let i = 0; i < numCellsPerTeam; i++) {
            const cell = Matter.Bodies.rectangle(
                Math.random() * 800 + 100, // Random x position within the play area
                Math.random() * 800 + 100, // Random y position within the play area
                30, // Width
                30, // Height
                {
                    frictionAir: 0.0005, // Air resistance
                    restitution: 0.99, // Bounciness
                    friction: 0.001, // Surface friction
                    render: {
                        fillStyle: team.color // Set the color of the cell
                    },
                    label: 'cell' // Label the cell
                }
            );

            const offset = 30; // Half of the cell's width/height
            const bodyParts = [];
            const constraints = [];

            cell.bodyParts = {
                top: null,
                left: null,
                right: null,
                bottom: null
            };

            const addBodyPart = (position, bodyPart) => {
                let body;
                if (bodyPart === 'Flagella') {
                    body = Matter.Bodies.rectangle(cell.position.x, cell.position.y + position.offset, 10, 30, {
                        render: {
                            sprite: {
                                texture: './Assets/Flagella.png',
                                xScale: 1,
                                yScale: 1
                            }
                        },
                        label: 'flagella'
                    });
                } else if (bodyPart === 'Jaw') {
                    body = Matter.Bodies.rectangle(cell.position.x, cell.position.y + position.offset, 10, 30, {
                        render: {
                            sprite: {
                                texture: './Assets/Jaws.png',
                                xScale: 1,
                                yScale: 1
                            }
                        },
                        label: 'jaw'
                    });
                }
                body.cell = cell; // Add reference to the cell
                bodyParts.push(body);
                constraints.push(Matter.Constraint.create({
                    bodyA: cell,
                    pointA: position.pointA,
                    bodyB: body,
                    pointB: { x: 0, y: 0 },
                    stiffness: 1,
                    length: 0
                }));
                cell.bodyParts[position.name] = bodyPart;
            };

            if (config.top) {
                addBodyPart({ offset: -offset, pointA: { x: 0, y: -offset }, name: 'top' }, config.top);
            }

            if (config.left) {
                addBodyPart({ offset: -offset, pointA: { x: -offset, y: 0 }, name: 'left' }, config.left);
            }

            if (config.right) {
                addBodyPart({ offset: offset, pointA: { x: offset, y: 0 }, name: 'right' }, config.right);
            }

            if (config.bottom) {
                addBodyPart({ offset: offset, pointA: { x: 0, y: offset }, name: 'bottom' }, config.bottom);
            }

            const cellComposite = Matter.Composite.create();
            Matter.Composite.addBody(cellComposite, cell);
            bodyParts.forEach(bodyPart => Matter.Composite.addBody(cellComposite, bodyPart));
            constraints.forEach(constraint => Matter.Composite.addConstraint(cellComposite, constraint));

            cell.team = team.name; // Store the team name in the cell
            cell.isFed = false; // Store whether the cell has been fed
            cell.generation = 0; // Store the generation of the cell
            cell.isAlive = true; // Store whether the cell is alive

            cells.push(cellComposite);
        }
    });

    return cells;
};
