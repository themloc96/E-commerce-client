import React from 'react';

export default function index(props) {
  const { stroke } = props;
  return (
    <svg
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      width={17}
      height={16}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m10.75 2-6 6 6 6"
        stroke={stroke || '#1C1C1C'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
