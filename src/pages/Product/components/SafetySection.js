import React from 'react';

function SafetySection({ safeties }) {
  if (!safeties || safeties.length <= 0) return null;
  return (
    <section id="product-detail" className="safety">
      <h3 className="text-center f20Medium lg:f30Medium">안전 기능</h3>
      <ul className="flex flex-wrap mt-16 safety-list">
        {safeties.slice(0, 4).map((item, idx) => {
          const { id, name, src } = item;
          return (
            <li
              key={`${id}-${name}`}
              className={`safety-item ${
                idx % 2 === 0 ? 'safety-item-left' : 'safety-item-right'
              } ${idx === 1 ? 'lg:ml-[-19px]' : ''}`}
              data-testid="list-item"
            >
              <img className="w-[72px] h-[72px]" src={src} alt={src} />
              <p
                className={`mt-[18px] lg:mt-[20px] text-center ${
                  idx === 0 ? 'max-120' : ''
                } ${idx === 2 ? 'max-149' : ''}`}
              >
                {name}
              </p>
            </li>
          );
        })}
      </ul>
      {safeties.slice(4, 999)?.length > 0 && <div className="divide-horizon" />}
      <ul className="flex flex-wrap mt-16 safety-list">
        {safeties.slice(4, 999).map((item, idx) => {
          const { id, name, src } = item;
          return (
            <li
              key={`${name}-${id}`}
              className={`safety-item ${
                idx % 2 === 0 ? 'safety-item-left' : 'safety-item-right'
              } ${idx === 1 ? 'lg:ml-[-19px]' : ''}`}
              data-testid="list-item"
            >
              <img className="w-[72px] h-[72px]" src={src} alt={src} />
              <p
                className={`mt-[18px] lg:mt-[20px] text-center ${
                  idx === 0 ? 'max-120' : ''
                } ${idx === 2 ? 'max-149' : ''}`}
              >
                {name}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

SafetySection.propTypes = {};

export default SafetySection;
