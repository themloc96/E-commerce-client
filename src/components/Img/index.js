import React from 'react';
import { generateUId, setOnErrorImage } from '../../utils/helpers';

function Img({ src, alt, className }) {
  const generatedId = generateUId();
  return (
    <img
      className={className}
      src={src || '/assets/products/no-image.png'}
      alt={alt}
      id={generatedId}
      onError={() => setOnErrorImage(generatedId)}
    />
  );
}

export default Img;
