import { Text } from 'react-konva'

type PlaceHolderTextProps = {
    centerX: number;
    centerY: number;
}
const PlaceholderText: React.FC<PlaceHolderTextProps> = ({ centerX, centerY }) => {
    return (
        <Text
            text="Select a task to visualize."
            x={centerX - 100}
            y={centerY - 100}
            fontSize={24}
            fill="white"
        />
    );
};

export default PlaceholderText