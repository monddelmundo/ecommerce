import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent } from "react";

interface Props {
  label: string;
  isLoading?: boolean;
  handleChange: (files: FileList | null) => void;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUpload: React.FC<Props> = ({ handleChange, label, isLoading }) => {
  return (
    <Button
      component="label"
      role={undefined}
      loading={isLoading}
      variant="contained"
      tabIndex={-1}
      sx={{ marginTop: 2, backgroundColor: "#071108" }}
      startIcon={<CloudUploadIcon />}
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={(event) => handleChange(event.target.files)}
      />
    </Button>
  );
};

export default FileUpload;
