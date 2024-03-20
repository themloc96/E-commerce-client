import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function LoadingBox() {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <ClipLoader color="#fc5000" />
      <p>Loading ...</p>
    </div>
  );
}
