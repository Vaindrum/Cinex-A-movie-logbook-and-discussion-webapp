import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRatingSlider = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    const stars = Array.from({ length: 5 });
  
    const handleMouseMove = (e, index) => {
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const position = e.clientX - left;
      setHoverRating(position < width / 2 ? index + 0.5 : index + 1);
    };
  
    const handleClick = () => {
      setRating(hoverRating);
    };
  
    const handleMouseLeave = () => {
      setHoverRating(0);
    };
  
    const renderStar = (index) => {
      const activeRating = hoverRating || rating;
      if (index + 1 <= Math.floor(activeRating)) {
        return <Star className='text-green-500 fill-green-500' size={32} />;
      } else if (index + 0.5 <= activeRating) {
        return <StarHalf  className='text-green-500 fill-green-500' size={32} />;
      } else {
        return <Star className='text-gray-500' size={32} />;
      }
    };
  
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex">
          {stars.map((_, index) => (
            <div
              key={index}
              onClick={handleClick}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer mr-1"
            >
              {renderStar(index)}
            </div>
          ))}
        </div>
        {/* <div className="text-xl font-semibold">Rating: {rating.toFixed(1)} / 5</div> */}
      </div>
    );
  };
  
  export default StarRatingSlider;
  