import { Circle } from "react-konva";

type TaskNodeProps = {
    x: number
    y: number
    opacity: number
    onClick: () => void
}
const TaskNode: React.FC<TaskNodeProps> = ({ x, y, opacity, onClick}) => {
    return (
        <>
           <Circle
            x={x}
            y={y}
            radius={3}
            hitStrokeWidth={6}
            fillLinearGradientStartPoint={{ x: -5, y: -5 }}
            fillLinearGradientEndPoint={{ x: 5, y: 5 }}
            fillLinearGradientColorStops={[0.7, "white", 1, "rgba(255,255,255,0.2)"]}
            opacity={opacity}
            shadowBlur={40}
            shadowColor="white"
            shadowOpacity={0.8}
            onMouseEnter={(e) => {
                e.target.to({ radius: 6, duration: 0.1 }); // Animates radius on hover
            }}
            onMouseLeave={(e) => {
                e.target.to({ radius: 3, duration: 0.1 }); // Resets radius when mouse leaves
            }}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        /> 

        </>
    );
}

export default TaskNode;