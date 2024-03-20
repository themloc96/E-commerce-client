import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { useQueryParams } from '../../hooks';
// API
import {
  searchHistoryFn,
} from '../../apis/mileage.api';

// scss
import mileageStyles from '../../styles/mileage/mileage.module.scss';

// util
import { formateDate, formatCost } from '../../utils/helpers';

// constants
import { roleMember, mileageType } from '../../constants';

// context
import { useAuthContext } from '../../contexts/AuthProvider';
import Pagination from '../../components/Pagination';

function Page() {
  const { state } = useAuthContext();
  const { currentUser, businessInfo } = state;
  const { filterParamsObj } = useQueryParams();
  const navigate = useNavigate();
  const { hash } = useLocation();

  const formatAmount = cost => {
    return (cost > 0 ? '+' : '') + formatCost(cost);
  };

  // #region
  /**
   * Tuong.TT 2023-06-20
   * API get history by id (query)
   * @param {string} id Optional, default: null
   * @returns {Promise<Array>} milleage history list
   */

  const { isLoading, data } =
    currentUser?.role === roleMember.ROLE_ADMIN
      ? useQuery(
          [filterParamsObj],
          () => searchHistoryFn({ ...filterParamsObj }),
          {
            onError: error => {
              console.log(error);
              console.log('Something went wrong!');
            },
          },
        )
      : useQuery(
          [businessInfo?.id || null, filterParamsObj],
          () =>
          searchHistoryFn({
              ...filterParamsObj,
              businessId: businessInfo?.id || null,
            }),
          {
            enabled: currentUser !== null,
            onError: error => {
              console.log(error);
              console.log('Something went wrong!');
            },
          },
        );

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

  // #endregion
  return (
    <div className={mileageStyles['keyin-body']}>
      <h3>마일리지 사용내역</h3>
      <div className={mileageStyles['keyin-list']}>
        <div className={mileageStyles['keyin-ul']}>
          {isLoading
            ? ''
            : data?.data?.list.map(dt => {
                // console.log(formateDate(dt.updatedAt), dt);
                return (
                  <div className={mileageStyles['keyin-li']} key={dt.id}>
                    <div className={mileageStyles.info}>
                      <div className={mileageStyles.date}>
                        <span>
                          {dt.updatedAt.split(' ')[0].replace(/-/g, '.')}
                        </span>
                      </div>
                      <div className={mileageStyles.title}>
                        <span
                          className={
                            dt.mileageAmount < 0
                              ? mileageStyles['keyin-color-danger']
                              : mileageStyles['keyin-color-primary']
                          }
                        >
                          {dt.mileageContent || ''}
                        </span>
                      </div>
                      <div className={mileageStyles.desc}>
                        <div
                          className={`${mileageStyles.name} text-start`}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <span
                            style={{ fontWeight: dt.orderCode ? 300 : 500 }}
                          >
                            {dt.mileageType ? mileageType[dt.mileageType] : ''}
                          </span>
                          <div
                            style={{
                              width: '1px',
                              height: '13px',
                              backgroundColor: '#ccc',
                              margin: '0 10px',
                              display: dt.orderCode ? 'flex' : 'none',
                            }}
                          >
                            {}
                          </div>
                          <span style={{ fontWeight: 500 }}>
                            {dt.orderCode ? dt.orderCode : ''}
                          </span>
                        </div>
                        <div className={mileageStyles.cost}>
                          <span
                            className={
                              dt.mileageAmount < 0
                                ? mileageStyles['keyin-color-danger']
                                : mileageStyles['keyin-color-primary']
                            }
                          >
                            {formatAmount(dt.mileageAmount)}
                          </span>{' '}
                          원
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          <Pagination
            onPrevPage={() =>
              handleGoToPage(Number(data?.metaData?.currentPage) - 1)
            }
            onNextPage={() =>
              handleGoToPage(Number(data?.metaData?.currentPage) + 1)
            }
            totalPages={data?.metaData?.totalPages}
            onChangePage={handleGoToPage}
            curPage={Number(data?.metaData?.currentPage) + 1}
            canPrevPage={data?.metaData?.currentPage > 0}
            canNextPage={
              data?.metaData?.currentPage <
              Number(data?.metaData?.totalPages) - 1
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
