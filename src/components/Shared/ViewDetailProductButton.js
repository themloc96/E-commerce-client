import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateNameId } from '../../utils/helpers';

function ViewDetailProductButton({
  productName,
  productId,
  label,
  className,
  isOpenNewTab = false,
}) {
  const navigate = useNavigate();
  const onRedirectToProductDetail = name =>
    isOpenNewTab
      ? window.open(`${window.location.origin}/product/${name}`)
      : navigate(`/product/${name}`);
  return (
    <button
      className={className}
      onClick={() => {
        onRedirectToProductDetail(
          generateNameId({
            name: productName,
            id: productId,
          }),
        );
      }}
    >
      <span>{label}</span>
    </button>
  );
}

export default ViewDetailProductButton;
