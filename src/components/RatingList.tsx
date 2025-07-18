import React from "react";
import RatingItem from "./RatingItem";

interface props {
  onClick: (rating: number) => void;
  selectedRating: number;
}

const RatingList: React.FC<props> = ({ onClick, selectedRating }) => {
  const ratings = [5, 4, 3, 2, 1];
  return (
    <div className="mb-5">
      {ratings.map((rating) => (
        <RatingItem
          selectedRating={selectedRating}
          key={rating}
          onClick={onClick}
          rating={rating}
        />
      ))}
    </div>
  );
};

export default React.memo(RatingList);
