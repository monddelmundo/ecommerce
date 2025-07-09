import { TextField } from "@mui/material";

interface props {
  label: string;
  placeholder: string;
  id: string;
  value: string;
  type?: string;
  className?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicTextField: React.FC<props> = ({
  label,
  placeholder,
  id,
  value,
  type = "text",
  className,
  handleChange,
}) => {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      id={id}
      className={className}
      label={label}
      type={type}
      value={value}
      onChange={handleChange}
    />
  );
};

export default BasicTextField;
