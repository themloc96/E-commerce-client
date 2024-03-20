import React, { useEffect } from 'react';

function AccessMethod({ product }) {
  const {
    productDesigns,
    productAppServices,
    accessMethods,
    productPlusLinks,
  } = product;
  const defaultAccessMethodList = [
    { label: '스마트폰 App', value: '스마트폰 App' },
    { label: '지문인식', value: '지문인식' },
    { label: '스마트카드키', value: '스마트키카드' },
    { label: '스틱키', value: '스틱키' },
    { label: '비밀번호', value: '비밀번호' },
    { label: '기계식키', value: '기계식키' },
    { label: '얼굴인식', value: '얼굴인식' },
  ];
  const newAccessMethodData = [];
  defaultAccessMethodList.map(defaultMethod => {
    const accessMethodMatched = accessMethods.find(
      method => defaultMethod.label === method.value,
    );
    if (accessMethodMatched) {
      return newAccessMethodData.push(accessMethodMatched);
    }
    return newAccessMethodData;
  });

  return (
    <section className="access-method border-bottom">
      {accessMethods.length > 0 && (
        <div className="flex">
          <p
            className="f16Medium mr-[23px] lg:mr-[66px] lg:f20Medium access-method-title"
            style={{ lineHeight: '1' }}
          >
            출입방식
          </p>
          <ul className="access-method-items">
            {newAccessMethodData.map(item => {
              const { text, value, icon } = item;
              return (
                <li key={value}>
                  <div className="bg-bg2 rounded-[10px]">
                    <img src={icon} alt={text} />
                  </div>
                  <p className="mt-2 text-center f12Regular xl:f16Regular">
                    {text}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-[49px] mb-[18px] flex">
        <p className="font-medium txt-title-access-method mr-[23px] lg:mr-[66px]">디자인</p>
        <p className="txt-description-access-method">
          {productDesigns.toString().replace(/,/g, ', ')}
        </p>
      </div>
      <div className="mb-6 lg:mt-[30px] lg:mb-[33px] flex">
        <p className="font-medium txt-title-access-method mr-[23px] lg:mr-[66px]">App서비스</p>
        <p className="txt-description-access-method">
          {productAppServices.toString().replace(/,/g, ', ')}
        </p>
      </div>
      <div className="mb-6 lg:mt-[30px] lg:mb-[33px] flex">
        <p className="font-medium txt-title-access-method mr-[23px] lg:mr-[66px]">플러스 링크</p>
        <p className="txt-description-access-method">
          {productPlusLinks.toString().replace(/,/g, ', ')}
        </p>
      </div>
    </section>
  );
}

AccessMethod.propTypes = {};

export default AccessMethod;
