import Svg, { Path, SvgProps } from "react-native-svg";

interface IconProps {
  props?: SvgProps;
  size?: number;
  color?: string;
}

export default function CloseCircleIcon({ props, size = 18, color }: IconProps) {
  return (
    <Svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM13.2803 4.71967C13.5732 5.01256 13.5732 5.48744 13.2803 5.78033L10.0607 9L13.2803 12.2197C13.5732 12.5126 13.5732 12.9874 13.2803 13.2803C12.9874 13.5732 12.5126 13.5732 12.2197 13.2803L9 10.0607L5.78033 13.2803C5.48744 13.5732 5.01256 13.5732 4.71967 13.2803C4.42678 12.9874 4.42678 12.5126 4.71967 12.2197L7.93934 9L4.71967 5.78033C4.42678 5.48744 4.42678 5.01256 4.71967 4.71967C5.01256 4.42678 5.48744 4.42678 5.78033 4.71967L9 7.93934L12.2197 4.71967C12.5126 4.42678 12.9874 4.42678 13.2803 4.71967Z"
        fill={color}
      />
    </Svg>
  );
}
