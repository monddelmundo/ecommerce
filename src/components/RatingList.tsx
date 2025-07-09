import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface props {
  onClick: (rating: number) => void;
  selectedRating: number;
}

const RatingList: React.FC<props> = ({ onClick, selectedRating }) => {
  const ratings = [5, 4, 3, 2, 1];
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
      if (rating >= i) renderItems.push(<StarIcon fontSize="inherit" />);
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

export default RatingList;
