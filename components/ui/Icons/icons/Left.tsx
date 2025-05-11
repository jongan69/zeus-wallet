export interface IconProps {
  style?: React.CSSProperties;
  size?: 18 | 14 | 12;
  color?: string;
}
export default function LeftIcon({ style, size = 18, color }: IconProps) {
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
        d="M11.5 3.5 5.58 8.926a.1.1 0 0 0 0 .148L11.5 14.5"
      />
    </svg>
  );
}
