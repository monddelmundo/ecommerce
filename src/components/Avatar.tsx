import { Avatar as AvatarMUI, SxProps, Theme } from "@mui/material";

interface Props {
  alt: string;
  src: string;
  sx: SxProps<Theme> | undefined;
}

const Avatar: React.FC<Props> = ({ alt, src, sx }) => {
  return <AvatarMUI alt={alt} src={src} sx={sx} />;
};

export default Avatar;
