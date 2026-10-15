const ICON_PATHS = {
  leaf: (
    <>
      <path d="M20.5 3.5C13 3.8 7.7 6.6 5.6 11.3c-1.8 4 .1 7.4 3.8 7.2 6.2-.4 9.8-6.7 11.1-15Z" />
      <path d="M3.5 21c3.3-6.2 7.4-10.1 12.7-12.4" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 14.5H3.5v5h17v-5H19" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4.5 17 4.2-4.2 3.1 3 2.1-2.1 5.6 5.3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7.5h3l1.4-2h7.2l1.4 2h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </>
  ),
  focus: (
    <>
      <path d="M8 3.5H4.5V7M16 3.5h3.5V7M8 20.5H4.5V17M16 20.5h3.5V17" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  history: (
    <>
      <path d="M4.2 8.1A8.5 8.5 0 1 1 3.8 15" />
      <path d="M4.2 3.8v4.3H8.5M12 7.5V12l3 1.8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v6M12 7.4h.01" />
    </>
  ),
  chevronDown: <path d="m6.5 9 5.5 5.5L17.5 9" />,
  expand: (
    <>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
      <path d="m4 9 5-5M20 9l-5-5M4 15l5 5M20 15l-5 5" />
    </>
  ),
  close: <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />,
  refresh: (
    <>
      <path d="M20 7.5V3.8l-2.2 2.1A8.5 8.5 0 0 0 4 9" />
      <path d="M4 16.5v3.7l2.2-2.1A8.5 8.5 0 0 0 20 15" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 4.2 2.8 17.5a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.5M12 17h.01" />
    </>
  ),
  check: <path d="m4.5 12.5 4.5 4.5L19.5 6.5" />,
  microscope: (
    <>
      <path d="m9.5 3 5 2-1 2.5-5-2L9.5 3ZM10.2 6.2 7.7 12a4.2 4.2 0 0 0 3.8 5.9h1.2" />
      <path d="M14.5 9.5a5.8 5.8 0 0 1 1.2 10H7M5 21h14" />
    </>
  ),
};

export function Icon({ name, size = 20, className }) {
  const paths = ICON_PATHS[name];

  if (!paths) return null;

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths}
    </svg>
  );
}

export default Icon;
