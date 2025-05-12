import { icons } from "@assets/icons";

interface SvqIconProps {
  name: string;
  className?: string;
  fill?: string;
  height?: string;
}

export const Icon = ({ name, fill, height, className = "" }: SvqIconProps) => {
  const SvgIcon = icons[name];

  if (!SvgIcon) {
    return <>SVG Icon Not Found</>;
  }
  if (fill && height) {
    return <SvgIcon fill={fill} height={height} className={className} />;
  }
  if (fill) {
    return <SvgIcon fill={fill} className={className} />;
  }
  if (height) {
    return <SvgIcon height={height} className={className} />;
  }

  return <SvgIcon className={className} />;
};
