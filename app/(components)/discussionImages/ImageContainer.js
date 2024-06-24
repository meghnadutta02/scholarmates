import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const ImageContainer = ({ data }) => {
    const chunkArray = (array, size) => {
        const chunkedArr = [];
        if (array) {
            for (let i = 0; i < array.length; i += size) {
                chunkedArr.push(array.slice(i, i + size));
            }
        }
        return chunkedArr;
    };


    const groupedImages = chunkArray(data, 3);


    return (
        <div className="carousel-container">
            <Carousel showThumbs={false} infiniteLoop useArrows>
                {groupedImages.map((group, index) => (
                    <div key={index} className="flex justify-center">
                        {group.map((src, subIndex) => (
                            <div key={subIndex} className="card mx-2">
                                <img src={src} alt={`Slide ${index + 1} - Image ${subIndex + 1}`} className="w-full h-60 object-cover rounded" />
                            </div>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default ImageContainer;
