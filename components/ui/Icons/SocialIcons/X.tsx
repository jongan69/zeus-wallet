import Svg, { Path, SvgProps } from "react-native-svg";

export interface IconProps {
  props?: SvgProps;
  size?: number;
  color?: string;
}

export default function XIcon({ props, size = 18, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      {...props}
    >
      <Path
        d="M13.9405 0H16.6548L10.725 6.77747L17.701 16H12.2379L7.95984 10.4066L3.06464 16H0.348719L6.69135 8.7508L0 0H5.59997L9.46708 5.11259L13.9405 0ZM12.9879 14.3754H14.4919L4.78363 1.53932H3.16963L12.9879 14.3754Z"
        fill={color}
      ></Path>
    </Svg>
  );
}
