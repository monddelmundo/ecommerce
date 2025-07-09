interface Props {
  title?: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
}

const Button: React.FC<Props> = ({ onClick, title, className, type }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={
        className
          ? className
          : `cursor-pointer mt-4 bg-[#071108] text-white px-4 py-2 rounded hover:bg-[#B5BEC6] hover:text-[#071108]`
      }
    >
      {title}
    </button>
  );
};

export default Button;
