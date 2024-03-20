import React from 'react';

function ProductDescription(props) {
  const { description } = props;
  return (
    <>
      <style>
        {`
        .productDetail p {
          width: 100%;
        }
        .productDetail img {
          width: 100%;
          object-fit: contain;
        }
        .productDetail {
          text-align: center;
          margin: auto;
          max-width: 860px;
        }
      `}
      </style>
      {/* eslint-disable-next-line react/no-danger */}
      <div
        className="productDetail"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </>
  );
}

export default ProductDescription;
