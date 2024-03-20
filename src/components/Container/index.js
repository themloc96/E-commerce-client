import React from 'react';

// eslint-disable-next-line react/function-component-definition
const Container = ({ children, className }) => {
  return (
    <div className={`px-3 mx-auto max-w-[1440px] xxl:px-0 ${className || ''}`}>
      {children}
    </div>
  );
};
export default Container;
