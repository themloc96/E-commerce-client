import React from 'react';

export default function index(props) {
  const { stroke } = props;
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m19.2 16.2-7.2-8-7.2 8"
        stroke={stroke || '#1C1C1C'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
