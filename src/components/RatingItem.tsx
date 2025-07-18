import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const RatingItem = ({
  rating,
  onClick,
  selectedRating,
}: {
  rating: number;
  selectedRating: number;
  onClick: (rating: number) => void;
}) => {
  let renderItems = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) renderItems.push(<StarIcon fontSize="inherit" key={i} />);
    else renderItems.push(<StarBorderIcon fontSize="inherit" key={i} />);
  }
  return (
    <div
      className={`cursor-pointer ${
        selectedRating === rating ? "bg-[#C7DBE6]" : ""
      }`}
      onClick={() => onClick(rating)}
    >
      {renderItems} {rating !== 5 && "& Up"}
      <br />
    </div>
  );
};

export default React.memo(RatingItem);
