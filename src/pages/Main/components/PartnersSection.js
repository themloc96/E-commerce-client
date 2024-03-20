import React, { Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import orderStyles from '../../../styles/main/order.module.scss';
import { getAllPartnersByBusinessIdFn } from '../../../apis/partner.api';
import { useAuthContext } from '../../../contexts/AuthProvider';
import LoadingBox from '../../../components/Loading/LoadingBox';
import { formatCost, generateUId } from '../../../utils/helpers';
import { businessType } from '../../../constants';

function PartnersSection() {
  const {
    state: { businessInfo },
  } = useAuthContext();
  const { id: businessId } = businessInfo || {
    id: null,
  };
  // query: partner list registed Data
  const { data, isLoading } = useQuery(
    [`v1/business/${businessId}/partners/all`],
    () => {
      return getAllPartnersByBusinessIdFn(businessId);
    },
    {
      enabled: Boolean(businessId),
    },
  );
  const { list: partners } = data || { list: null };

  if (businessInfo?.businessType !== businessType.AGENCY) return null;

  return (
    <>
      {isLoading && <LoadingBox />}
      {!isLoading && partners?.length > 0 && (
        <>
          <div className={orderStyles['keyin-partner-status']}>
            <div className={orderStyles.status}>
              <span>내 파트너 현황</span>
              <img src="/assets/logos/bk.svg" alt="" />
            </div>
            <Link to="/my-page#partner" className={orderStyles.view}>
              전체보기
              <img src="/assets/arrow/right-dark.svg" alt="" />
            </Link>
          </div>
          <div className={orderStyles['keyin-list']}>
            <div className={orderStyles.header}>
              <div className={orderStyles.company}>업체명</div>
              <div className={orderStyles.representative}>대표자</div>
              <div className={orderStyles.performance}>
                {window.innerWidth <= 400 ? '주문실적' : '주문 실적'}
              </div>
            </div>
            <hr />
            <div className={orderStyles.body}>
              {partners.map(item => {
                const {
                  businessName,
                  businessRepresentativeName,
                  sumAmountOrders,
                } = item;
                return (
                  <Fragment key={generateUId()}>
                    <div className={orderStyles.info}>
                      <div className={orderStyles.company}>{businessName}</div>
                      <div className={orderStyles.representative}>
                        {businessRepresentativeName}
                      </div>
                      <div className={orderStyles.performance}>
                        {formatCost(sumAmountOrders)}
                        <span>원</span>
                      </div>
                    </div>
                    <hr />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PartnersSection;
