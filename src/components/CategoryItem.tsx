type CategoryItem = {
  categoryTitle: string;
  isActive: boolean;
  onClick: () => void;
};

const CategoryItem = ({ categoryTitle, isActive, onClick }: CategoryItem) => {
  return (
    <li
      onClick={onClick}
      className={`cursor-pointer underline ${
        isActive ? "text-[#071108]" : "text-[#364652]"
      }`}
    >
      {categoryTitle}
    </li>
  );
};

export default CategoryItem;
