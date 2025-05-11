export interface IconProps {
  style?: React.CSSProperties;
  size?: 18 | 16 | 14 | 12;
  color?: string;
}
export default function ChevronDownSmallIcon({
  style,
  size = 16,
  color,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 16"
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8259 6.16667L8.20636 9.78619C8.18032 9.81223 8.13811 9.81223 8.11208 9.78619L4.49255 6.16667"
        stroke={color ?? "#000"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />
    </svg>
  );
}
