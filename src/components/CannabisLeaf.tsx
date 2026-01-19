import { CSSProperties } from "react";

interface CannabisLeafProps {
  className?: string;
  size?: number;
  style?: CSSProperties;
}

export function CannabisLeaf({ className = "", size = 24, style }: CannabisLeafProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M12 2C12 2 10.5 4.5 10 7C9.5 9.5 9.8 11 10 12C9 11.8 7.5 11.5 6 11C4.5 10.5 3 10 2 10C2 10 3.5 11.5 5 12.5C6.5 13.5 8 14 9 14.2C8.5 14.5 7.5 15.2 6.5 16.5C5.5 17.8 5 19 5 20C5 20 6.5 19 8 17.5C9.5 16 10.5 14.8 11 14C11 14.5 11 15.5 11 17C11 18.5 11 20 11 21C11 21 11.5 20 12 18.5C12.5 17 12.8 15.5 13 14C13.5 14.8 14.5 16 16 17.5C17.5 19 19 20 19 20C19 20 18.5 17.8 17.5 16.5C16.5 15.2 15.5 14.5 15 14.2C16 14 17.5 13.5 19 12.5C20.5 11.5 22 10 22 10C22 10 20.5 10.5 19 11C17.5 11.5 16 11.8 15 12C15.2 11 15.5 9.5 15 7C14.5 4.5 12 2 12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8C12 8 11.5 10 11.2 11.5C11.5 11.3 12 11 12 11C12 11 12.5 11.3 12.8 11.5C12.5 10 12 8 12 8Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}