import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Text, Image } from 'react-konva';
import useImage from 'use-image'; // Correct import for use-image hook
import Konva from 'konva'; // Import Konva to use filters
import { Task, Alignment } from './types';
import { calculateIndirectAlignments } from './calculateVectorSpace';

interface TaskStarVisualizationProps {
    tasks: Task[];
    alignments: Alignment[];
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const BASE_UNIT_IN_PIXELS = 50;
const UNIT_SCALE: Record<string, number> = { Hours: 1, Days: 2, Weeks: 3, Months: 4, Years: 5 };
const SCALE_FACTOR = 1;

const BACKGROUND_IMAGE_URL = './background.webp';

const TaskStarVisualization: React.FC<TaskStarVisualizationProps> = ({
    tasks,
    alignments,
    selectedTask,
    setSelectedTask
}) => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [backgroundImage] = useImage(BACKGROUND_IMAGE_URL); // Load background image
    const imageRef = useRef<any>(null); // Use `any` type for imageRef to avoid TypeScript issues

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
            imgNode.brightness(-0.3); // Reduce brightness (0 is normal, less than 0 darkens, greater brightens)
            imgNode.getLayer()?.batchDraw(); // Redraw the layer after applying the filter
        }
    }, [backgroundImage]);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const allAlignments = [
        ...alignments,
        ...(selectedTask ? calculateIndirectAlignments(selectedTask.id, alignments) : []),
    ];

    const getMagnitude = (effort: number, unit: keyof typeof UNIT_SCALE): number => {
        return effort * BASE_UNIT_IN_PIXELS * UNIT_SCALE[unit] * SCALE_FACTOR;
    };

    const calculateStarCoordinates = (task: Task): { x: number; y: number } => {
        const magnitude = getMagnitude(1.0, task.unit);

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
        const x = centerX + Math.sin(radians) * magnitude;
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
                        newOpacity = Math.max(0.5, newOpacity - 0.03); // Slowly fade it to dimmer opacity
                    }

                    newTwinkle[task.id] = newOpacity; // Set the new opacity
                });
                return newTwinkle;
            });
        }, 100); // Run the effect with a slower frequency to make the change noticeable (100ms)

        return () => clearInterval(interval);
    }, [tasks]);




    const handleTaskSelect = (task: Task) => {
        setSelectedTask(task);
    };

    return (
        <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
                {/* Render the background image */}
                {backgroundImage && (
                    <Image
                        image={backgroundImage}
                        width={dimensions.width}
                        height={dimensions.height}
                        ref={imageRef} // Assign the ref to the Image node
                    />
                )}

                {/* Placeholder text when no task is selected */}
                {!selectedTask && (
                    <Text
                        text="Select a task to visualize."
                        x={centerX - 100}
                        y={centerY - 20}
                        fontSize={24}
                        fill="white"
                    />
                )}

                {tasks.map((task) => {
                    const { x, y } = calculateStarCoordinates(task);

                    return (
                        <Circle
                            key={task.id}
                            x={x}
                            y={y}
                            radius={hoveredTask === task ? 10 : 4}
                            fillLinearGradientStartPoint={{ x: -5, y: -5 }}
                            fillLinearGradientEndPoint={{ x: 5, y: 5 }}
                            fillLinearGradientColorStops={[0.7, 'white', 1, 'rgba(255,255,255,0.2)']} // Increase the gradient opacity for a brighter effect
                            opacity={twinkle[task.id] || 1} // Use the twinkling opacity here
                            shadowBlur={40} // Reduce shadow blur for a more concentrated light effect
                            shadowColor="white"
                            shadowOpacity={0.8} // Add shadow opacity to make the glow effect more intense
                            onMouseEnter={() => setHoveredTask(task)}
                            onMouseLeave={() => setHoveredTask(null)}
                            onClick={() => handleTaskSelect(task)}
                            style={{ cursor: 'pointer' }}
                        />

                    );
                })}
            </Layer>
        </Stage>
    );
};

export default TaskStarVisualization;
