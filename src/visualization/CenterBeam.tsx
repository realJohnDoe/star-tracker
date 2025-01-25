import React from 'react';
import { Rect } from 'react-konva';

type CenterBeamProps = {
    centerX: number;
    centerY: number;
    dimensions: { height: number };
    falloff: number;
    maxBeam: string;
};

const CenterBeam: React.FC<CenterBeamProps> = ({ centerX, centerY, dimensions, falloff, maxBeam }) => {
    return (
        <Rect
            x={centerX - 25}
            y={centerY}
            width={50}
            height={-dimensions.height}
            fillLinearGradientStartPoint={{ x: 0, y: centerY }}
            fillLinearGradientEndPoint={{ x: 50, y: centerY }}
            fillLinearGradientColorStops={[
                0, 'rgba(255, 255, 255, 0)',
                0.5 - falloff, maxBeam,
                0.5 + falloff, maxBeam,
                1, 'rgba(255, 255, 255, 0)'
            ]}
        />
    );
};

export default CenterBeam;
