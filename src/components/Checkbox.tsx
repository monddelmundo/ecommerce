import { Checkbox as MUICheckbox, FormControlLabel } from "@mui/material";

interface props {
  checked: boolean;
  title?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<props> = ({ checked, handleChange, title }) => {
  return (
    <FormControlLabel
      labelPlacement="end"
      control={
        <MUICheckbox
          checked={checked}
          onChange={(e) => handleChange(e)}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={title}
    />
  );
};

export default Checkbox;
