import React from 'react';
import { getConveniencesByStrings } from '../../../utils/productUtils';

function ConvenienceSection({ productConvenienceFunctions }) {
  const convenienceList = getConveniencesByStrings(productConvenienceFunctions);
  if (convenienceList.length <= 0) return null;
  return (
    // REUSE CLASS OF SAFETY
    <section id="product-detail" className="safety">
      <h3 className="text-center f20Medium lg:f30Medium">편의 기능</h3>
      <ul className="flex flex-wrap mt-16 safety-list">
        {convenienceList.slice(0, 4).map((item, idx) => {
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
      {convenienceList.slice(4, 8)?.length > 0 && (
        <div className="divide-horizon" />
      )}
      <ul className="flex flex-wrap mt-16 safety-list">
        {convenienceList.slice(4, 8).map((item, idx) => {
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
      {convenienceList.slice(8, 999)?.length > 0 && (
        <div className="divide-horizon" />
      )}
      <ul className="flex flex-wrap mt-16 safety-list md:!justify-start">
        {convenienceList.slice(8, 999).map((item, idx) => {
          const { id, name, src } = item;
          return (
            <li
              key={id}
              className={`safety-item md:!flex-none md:!w-[293.5px] ${
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

ConvenienceSection.propTypes = {};

export default ConvenienceSection;
