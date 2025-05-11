export interface IconProps {
  style?: React.CSSProperties;
  size?: 18 | 14 | 12;
  color?: string;
}
export default function FilterIcon({ style, size = 18, color }: IconProps) {
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
        d="M3.25 3v7.5m0 4.5v-.5M8.75 3v3.5m0 8.5v-4.5M14.75 3v1.5m0 10.5V8.5"
      />
      <circle
        cx={3.25}
        cy={12.5}
        r={1.75}
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={8.75}
        cy={8.5}
        r={1.75}
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={14.75}
        cy={6.5}
        r={1.75}
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
