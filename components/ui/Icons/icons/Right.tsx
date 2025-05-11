export interface IconProps {
  style?: React.CSSProperties;
  size?: 18 | 14 | 12;
  color?: string;
}
export default function RightIcon({ style, size = 18, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      style={style}
      fill="none"
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        d="m6.5 3.5 5.92 5.426a.1.1 0 0 1 0 .148L6.5 14.5"
      />
    </svg>
  );
}
