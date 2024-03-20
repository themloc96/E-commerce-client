import React from 'react';

export default function index(props) {
  const { stroke } = props;
  return (
    <svg
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m4.8 8.2 7.2 8 7.2-8"
        stroke={stroke || '#1c1c1c'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
