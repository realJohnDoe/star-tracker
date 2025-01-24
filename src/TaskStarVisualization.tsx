import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Text, Image, Line, Rect } from 'react-konva';
import useImage from 'use-image'; // Correct import for use-image hook
import Konva from 'konva'; // Import Konva to use filters
import { Task, Alignment, taskUnitValues } from './types';
import { calculateIndirectAlignments } from './calculateVectorSpace';

interface TaskStarVisualizationProps {
    tasks: Task[];
    alignments: Alignment[];
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const BASE_UNIT_IN_PIXELS = 50;
const UNIT_SCALE: Record<typeof taskUnitValues[number], number> = { Hours: 1, Days: 2, Weeks: 3, Months: 4, Years: 5, Evergreen: 6 };
const SCALE_FACTOR = 1;

const BACKGROUND_IMAGE_URL = './background-4k.jpg';

const TaskStarVisualization: React.FC<TaskStarVisualizationProps> = ({
    tasks,
    alignments,
    selectedTask,
    setSelectedTask
}) => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [backgroundImage] = useImage(BACKGROUND_IMAGE_URL); // Load background image
    const imageRef = useRef<any>(null); // Use `any` type for imageRef to avoid TypeScript issues

    const [randomXSign, setRandomXSign] = useState<Record<number, number>>({});

    useEffect(() => {
        // Initialize the random x-direction for each task only once
        const initialXSign: Record<number, number> = {};
        tasks.forEach((task) => {
            initialXSign[task.id] = Math.random() < 0.5 ? -1 : 1;
        });
        setRandomXSign(initialXSign);
    }, [tasks]);

    // Set up the background image filter on load
    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (backgroundImage && imageRef.current) {
            // Apply brightness filter when the image is loaded
            const imgNode = imageRef.current;
            imgNode.cache(); // Cache the image for better performance
            imgNode.filters([Konva.Filters.Brighten]); // Apply brightness filter
            imgNode.brightness(-0.1); // Reduce brightness (0 is normal, less than 0 darkens, greater brightens)
            imgNode.getLayer()?.batchDraw(); // Redraw the layer after applying the filter

            imgNode.getLayer()?.batchDraw(); // Redraw the layer after applying changes
        }
    }, [backgroundImage]);


    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const falloff = 0.1;
    const maxBeam = 'rgba(255, 255, 255, 0.149)'

    const allAlignments = [
        ...alignments,
        ...(selectedTask ? calculateIndirectAlignments(selectedTask.id, alignments) : []),
    ];

    const getMagnitude = (duration: number, unit: keyof typeof UNIT_SCALE): number => {
        return duration * BASE_UNIT_IN_PIXELS * UNIT_SCALE[unit] * SCALE_FACTOR;
    };

    const calculateStarCoordinates = (task: Task): { x: number; y: number } => {
        const magnitude = getMagnitude(1.3, task.unit);

        if (task.id === selectedTask?.id) {
            return { x: centerX, y: centerY - magnitude };
        }

        const alignment = allAlignments.find(
            (a) =>
                (a.task1 === selectedTask?.id && a.task2 === task.id) ||
                (a.task1 === task.id && a.task2 === selectedTask?.id)
        );

        let angle = 90;
        if (alignment) {
            angle = (1 - alignment.value / 100) * 90;
        }

        const radians = (angle * Math.PI) / 180;
        const xSign = randomXSign[task.id] || 1;  // Use precomputed random x-sign
        const x = centerX + xSign * Math.sin(radians) * magnitude;
        const y = centerY - Math.cos(radians) * magnitude;

        return { x, y };
    };


    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [twinkle, setTwinkle] = useState<Record<number, number>>({});

    // Update the twinkling effect to create sudden bursts and slow dimming
    useEffect(() => {
        const interval = setInterval(() => {
            setTwinkle((prev) => {
                const newTwinkle: Record<number, number> = {};
                tasks.forEach((task) => {
                    // Create a random factor to decide when to burst
                    const flashChance = Math.random();
                    let newOpacity = prev[task.id] || 0.7; // Start with a default opacity

                    // 10% chance for a burst (sudden brightness)
                    if (flashChance < 0.01) {
                        newOpacity = 1; // Brighten the star instantly
                    } else {
                        newOpacity = Math.max(0.7, newOpacity - 0.03); // Slowly fade it to dimmer opacity
                    }

                    newTwinkle[task.id] = newOpacity; // Set the new opacity
                });
                return newTwinkle;
            });
        }, 100); // Run the effect with a slower frequency to make the change noticeable (100ms)

        return () => clearInterval(interval);
    }, [tasks]);

    const generateLensFlare = (task: Task) => {
        const rays = [];
        const numberOfRays = 12; // Number of rays for the lens flare

        // Get coordinates of the selected task's star
        const { x, y } = calculateStarCoordinates(task);

        // Calculate the angular step between each ray (evenly spaced)
        const angleStep = (2 * Math.PI) / numberOfRays;

        // Generate rays at constant, evenly distributed angles
        for (let i = 0; i < numberOfRays; i++) {
            const angle = i * angleStep; // Evenly spaced angles around the circle
            const length = 7 + 5 * (i % 2); // Random length for rays
            const offsetX = Math.cos(angle) * length;
            const offsetY = Math.sin(angle) * length;

            // Create each ray as a line element
            rays.push(
                <Line
                    key={`lensFlareRay-${i}`}
                    points={[x, y, x + offsetX, y + offsetY]} // Start and end points of the ray
                    stroke="rgba(255, 255, 255, 0.8)" // Soft white color for the rays
                    strokeWidth={2} // Thin lines for rays
                    opacity={0.5}
                    lineCap="round" // Round the end of the rays
                    lineJoin="round" // Round the joints between rays
                />
            );
        }

        return rays;
    };





    const handleTaskSelect = (task: Task) => {
        setSelectedTask(task);
    };

    return (
        <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
                {backgroundImage && (() => {
                    // Original image dimensions
                    const imgWidth = backgroundImage.width;
                    const imgHeight = backgroundImage.height;

                    // Screen dimensions
                    const screenWidth = dimensions.width;
                    const screenHeight = dimensions.height;

                    // Customizable alignment offsets (values range -1 to 1)
                    const customOffsetX = 0.0;  // Move left (-) or right (+)
                    const customOffsetY = 0.2; // Move up (-) or down (+)

                    // Define how much of the image we want to use, influenced by offsets
                    const cropWidth = imgWidth * (1 - Math.abs(customOffsetX));
                    const cropHeight = imgHeight * (1 - Math.abs(customOffsetY));

                    // Calculate the cropping region based on alignment offsets
                    const cropX = (imgWidth - cropWidth) / 2 + customOffsetX * (imgWidth / 2);
                    const cropY = (imgHeight - cropHeight) / 2 + customOffsetY * (imgHeight / 2);

                    // Calculate the scale factor to fit the cropped region to the screen
                    const scaleFactor = Math.max(screenWidth / cropWidth, screenHeight / cropHeight);

                    // Calculate final scaled size
                    const scaledWidth = cropWidth * scaleFactor;
                    const scaledHeight = cropHeight * scaleFactor;

                    // Calculate the final position to align the image to the screen
                    const finalX = -cropX * scaleFactor;
                    const finalY = -cropY * scaleFactor;

                    return (
                        <Image
                            image={backgroundImage}
                            ref={imageRef}
                            x={finalX}
                            y={finalY}
                            width={scaledWidth}
                            height={scaledHeight}
                            crop={{
                                x: cropX,
                                y: cropY,
                                width: cropWidth,
                                height: cropHeight,
                            }}
                        />
                    );
                })()}


                {/* Render the vertical line with transparency gradient */}
                <Rect
                    x={centerX - 25}
                    y={centerY + 25}
                    width={50} // Thin vertical line
                    height={-dimensions.height}
                    fillLinearGradientStartPoint={{ x: 0, y: centerY }}
                    fillLinearGradientEndPoint={{ x: 50, y: centerY }}
                    fillLinearGradientColorStops={[0, 'rgba(255, 255, 255, 0)', 0.5 - falloff, maxBeam, 0.5 + falloff, maxBeam, 1, 'rgba(255, 255, 255, 0)']}
                />

                {/* Placeholder text when no task is selected */}
                {!selectedTask && (
                    <Text
                        text="Select a task to visualize."
                        x={centerX - 100}
                        y={centerY - 100}
                        fontSize={24}
                        fill="white"
                    />
                )}


                {/* Render scattering effect (lens flare) around the selected task */}
                {selectedTask && generateLensFlare(selectedTask)}
                {selectedTask && (() => {
                    const { x, y } = calculateStarCoordinates(selectedTask);
                    return (
                        <Text
                            text={selectedTask.name}
                            x={x - 20}
                            y={y - 35}
                            fontSize={16}
                            fill="white"
                            align="center"
                            fontStyle="bold"
                        />
                    );
                })()}

                {tasks
                    .filter((task) =>
                        selectedTask &&
                        allAlignments.some((a) =>
                            ((a.task1 === selectedTask.id && a.task2 === task.id) ||
                                (a.task1 === task.id && a.task2 === selectedTask.id)) &&
                            a.value > 0
                        )
                    )
                    .map((task) => {
                        const { x, y } = calculateStarCoordinates(task);

                        return (
                            <React.Fragment>
                                <Circle
                                    key={task.id}
                                    x={x}
                                    y={y}
                                    radius={hoveredTask === task ? 6 : 3}
                                    hitStrokeWidth={6}
                                    fillLinearGradientStartPoint={{ x: -5, y: -5 }}
                                    fillLinearGradientEndPoint={{ x: 5, y: 5 }}
                                    fillLinearGradientColorStops={[0.7, 'white', 1, 'rgba(255,255,255,0.2)']}
                                    opacity={twinkle[task.id] || 1}
                                    shadowBlur={40}
                                    shadowColor="white"
                                    shadowOpacity={0.8}
                                    onMouseEnter={() => setHoveredTask(task)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                    onClick={() => handleTaskSelect(task)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Text
                                    text={task.name}
                                    x={x - 20}
                                    y={y - 25}
                                    fontSize={14}
                                    fill="white"
                                    align="center"
                                />
                            </React.Fragment>
                        );
                    })}

                {alignments
                    .filter((alignment) => alignment.value > 0) // Only consider alignments with a positive value
                    .map((alignment) => {
                        // Find the tasks for the current alignment
                        const task1 = tasks.find((task) => task.id === alignment.task1);
                        const task2 = tasks.find((task) => task.id === alignment.task2);

                        // If both tasks are found and visible (either they are the selected task or they have a positive alignment)
                        if (task1 && task2) {
                            const isTask1Visible = tasks.some((task) => task.id === task1.id && (
                                !selectedTask || (selectedTask.id === task1.id || allAlignments.some(
                                    (a) => (a.task1 === selectedTask.id && a.task2 === task1.id) ||
                                        (a.task1 === task1.id && a.task2 === selectedTask.id)
                                ))
                            ));

                            const isTask2Visible = tasks.some((task) => task.id === task2.id && (
                                !selectedTask || (selectedTask.id === task2.id || allAlignments.some(
                                    (a) => (a.task1 === selectedTask.id && a.task2 === task2.id) ||
                                        (a.task1 === task2.id && a.task2 === selectedTask.id)
                                ))
                            ));

                            // If both tasks are visible, render the line
                            if (isTask1Visible && isTask2Visible) {
                                const { x: x1, y: y1 } = calculateStarCoordinates(task1);
                                const { x: x2, y: y2 } = calculateStarCoordinates(task2);

                                return (
                                    <Line
                                        key={`line-${task1.id}-${task2.id}`}
                                        points={[x1, y1, x2, y2]} // Points from task1 to task2
                                        stroke="rgba(255, 255, 255, 0.5)" // Semi-transparent white color
                                        strokeWidth={2} // Line width
                                        opacity={0.5} // Adjust opacity as needed
                                        lineCap="round" // Rounded line ends
                                        lineJoin="round" // Rounded joints between lines
                                        dash={[5, 5]} // Optional: add dashed effect
                                    />
                                );
                            }
                        }

                        return null;
                    })}



            </Layer>
        </Stage>
    );
};

export default TaskStarVisualization;
