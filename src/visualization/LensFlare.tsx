import { Line } from "react-konva";

type LensFlareProps = {
    x: number
    y: number
}

const LensFlare: React.FC<LensFlareProps> = ({x, y}) => {
    const rays = [];
    const numberOfRays = 12; // Number of rays for the lens flare

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

export default LensFlare