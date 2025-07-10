interface Props {
  title?: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
}

const Button: React.FC<Props> = ({
  onClick,
  title,
  className,
  type,
  isLoading,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={
        className
          ? className
          : `flex items-center justify-center cursor-pointer mt-4 bg-[#071108] text-white px-4 py-2 rounded hover:bg-[#B5BEC6] hover:text-[#071108]`
      }
    >
      {isLoading && (
        <svg
          className="w-4 h-4 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
          />
        </svg>
      )}
      {isLoading ? "Logging In" : title}
    </button>
  );
};

export default Button;
