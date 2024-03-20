import React, { useCallback } from 'react';

function TabsSection() {
  const onScrollToView = useCallback(id => {
    document.querySelector(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  }, []);
  return (
    <section className="tabs">
      <div className="tab detail-info">
        <span className="font-medium text-primary">제품 상세</span>
      </div>
      <div className="tab main-function">
        <span
          role="button"
          tabIndex={0}
          className="text-textSecondary1"
          onClick={() => {
            onScrollToView('#product-detail');
          }}
        >
          주요 기능
        </span>
      </div>
    </section>
  );
}

export default TabsSection;
