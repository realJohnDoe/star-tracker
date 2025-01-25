import React from 'react';
import { Image } from 'react-konva';

interface BackgroundImageProps {
    backgroundImage: HTMLImageElement | undefined;
    dimensions: {
        width: number;
        height: number;
    };
    imageRef: React.MutableRefObject<any>
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ backgroundImage, dimensions, imageRef }) => {
    return (
        <>
            {backgroundImage && (() => {
                // Original image dimensions
                const imgWidth = backgroundImage.width;
                const imgHeight = backgroundImage.height;

                // Screen dimensions
                const screenWidth = dimensions.width;
                const screenHeight = dimensions.height;

                // Customizable alignment offsets (values range -1 to 1)
                const customOffsetX = 0.0;  // Move left (-) or right (+)
                const customOffsetY = 0.205; // Move up (-) or down (+)

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
        </>
    );
};

export default BackgroundImage;
