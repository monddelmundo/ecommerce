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
        isActive ? "text-blue-500" : "text-gray-800"
      }`}
    >
      {categoryTitle}
    </li>
  );
};

export default CategoryItem;
