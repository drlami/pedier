import type { SVGProps } from "react";

export function StethoscopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a2 2 0 1 0 4 0V6a2 2 0 1 0-4 0v8Z" />
      <path d="M6 4V2" />
      <path d="M6 20v-4" />
      <path d="M12 14h2a2 2 0 0 0 2-2V8" />
      <path d="M20 8a2 2 0 0 0-2-2h-2" />
      <path d="M14 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
      <circle cx="20" cy="14" r="2" />
    </svg>
  );
}
