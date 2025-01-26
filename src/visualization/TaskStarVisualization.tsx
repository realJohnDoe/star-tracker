import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import useImage from 'use-image'; // Correct import for use-image hook
import Konva from 'konva'; // Import Konva to use filters
import { Task, Alignment, taskUnitValues } from '../types';
import { calculateIndirectAlignments } from '../calculateVectorSpace';
import AlignmentLines from "./AlignmentLines"
import BackgroundImage from './BackgroundImage';
import CenterBeam from './CenterBeam';
import PlaceholderText from './PlaceholderText';
import LensFlare from './LensFlare';
import TaskNode from './TaskNode';

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

    const handleTaskSelect = (taskId: number) => {
        const task = tasks.find((task) => task.id === taskId) || null;
        setSelectedTask(task);
    };


    return (
        <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
                <BackgroundImage
                    backgroundImage={backgroundImage}
                    dimensions={dimensions}
                    imageRef={imageRef}
                />


                {/* Render the vertical line with transparency gradient */}
                <CenterBeam
                    centerX={centerX} centerY={centerY} dimensions={dimensions} falloff={falloff} maxBeam={maxBeam}
                />

                {/* Placeholder text when no task is selected */}
                {!selectedTask &&
                    <PlaceholderText
                        centerX={centerX}
                        centerY={centerY}
                    ></PlaceholderText>
                }

                {selectedTask && (() => {
                    const { x, y } = calculateStarCoordinates(selectedTask);
                    
                    return (
                        <>
                        <LensFlare
                            x={x}
                            y={y}
                        />
                        <Text
                            text={selectedTask.name}
                            x={x - 20}
                            y={y - 35}
                            fontSize={16}
                            fill="white"
                            align="center"
                            fontStyle="bold"
                        />
                        </>
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
                                <TaskNode
                                    x={x}
                                    y={y}
                                    opacity={twinkle[task.id] || 1}
                                    onClick={() => handleTaskSelect(task.id)}
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

                <AlignmentLines
                    tasks={tasks}
                    alignments={alignments}
                    allAlignments={allAlignments}
                    selectedTask={selectedTask}
                    calculateStarCoordinates={calculateStarCoordinates}
                />
            </Layer>
        </Stage>
    );
};

export default TaskStarVisualization;
