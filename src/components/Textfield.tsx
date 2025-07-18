import { SxProps, TextField, Theme } from "@mui/material";
import React from "react";

interface props {
  label: string;
  placeholder?: string;
  id: string;
  value: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme> | undefined;
  name?: string;
  type?: string;
  required?: boolean;
  className?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicTextField: React.FC<props> = ({
  label,
  placeholder,
  id,
  sx,
  value,
  fullWidth,
  type = "text",
  name,
  className,
  required,
  handleChange,
}) => {
  return (
    <TextField
      size="small"
      sx={sx}
      placeholder={placeholder}
      id={id}
      className={className}
      label={label}
      type={type}
      name={name}
      required={required}
      fullWidth={fullWidth}
      value={value}
      onChange={handleChange}
    />
  );
};

export default React.memo(BasicTextField);
