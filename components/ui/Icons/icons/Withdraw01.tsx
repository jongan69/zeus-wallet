export interface IconProps {
  style?: React.CSSProperties;
  size?: 18 | 14 | 12;
  color?: string;
}
export default function Withdraw01Icon({ style, size = 18, color }: IconProps) {
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
        strokeLinejoin="round"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        d="M6.344 5.31h6.391m0 0v6.301m0-6.3L5.31 12.734"
      />
    </svg>
  );
}
