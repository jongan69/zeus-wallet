import Svg, { Path, SvgProps } from "react-native-svg";

interface IconProps {
  props?: SvgProps;
  size?: number;
  color?: string;
}

export default function ButtonArrow({ props, size = 18, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <Path
        d="M13.25 2H4.75C3.233 2 2 3.233 2 4.75V13.25C2 14.767 3.233 16 4.75 16H13.25C14.767 16 16 14.767 16 13.25V4.75C16 3.233 14.767 2 13.25 2ZM12.03 10.28L9.53 12.78C9.384 12.926 9.192 13 9 13C8.808 13 8.616 12.927 8.47 12.78L5.97 10.28C5.677 9.987 5.677 9.512 5.97 9.219C6.263 8.926 6.738 8.926 7.031 9.219L8.251 10.439V5.75C8.251 5.336 8.587 5 9.001 5C9.415 5 9.751 5.336 9.751 5.75V10.439L10.971 9.219C11.264 8.926 11.739 8.926 12.032 9.219C12.325 9.512 12.325 9.987 12.032 10.28H12.03Z"
        fill={color}
      />
    </Svg>
  );
}
