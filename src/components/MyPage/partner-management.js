/* eslint-disable no-unused-vars */
import { useQuery, useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
// notistack
import { useSnackbar } from 'notistack';

// COMPs
import ModalComponent from '../core/modal-base';
import Popover from '../Popover';

// API
import {
  getOrderAmountCurrentMonthFn,
  getOrderAmountLastMonthFn,
} from '../../apis/order.api';
import {
  deletePartnerFn,
  getAllPartnersByBusinessIdFn,
} from '../../apis/partner.api';

// Context
import { useAuthContext } from '../../contexts/AuthProvider';

// Hook
import useGetElementCoords from '../../hooks/useGetElementCoods';

// Utils
import { formatNumber, generateUId, copyLink } from '../../utils/helpers';

// Popover
import SharePopoverContent from '../Popover/SharePopoverContent';

// Components
import RegisterMyPartnerModal from './components/register-my-partner-modal';
import { SIGN_UP_REPRESENTATIVE } from '../routes/Routes';
import { REACT_APP_KAKAO_ID } from '../../constants/AppConfig';

export default function PartnerManagement() {
  function Style() {
    return (
      <style>
        {`
            .keyin-container {padding-left: 0px; padding-right: 0px;}
            .modal-share {
              bottom: 0!important;
              left: 0!important;
              right: 0!important;
              top: auto!important;
              margin-right: 0!important;
              border: none!important;
              box-shadow: none!important;
              padding: 16px!important;
              border-radius: 0px!important;
              padding: 0px!important;
              background: none!important;
              width: 100%!important;
              position: absolute;
              transform: none!important;
              outline: 0 !important;
              .modal-header{
                padding-bottom: 8.2px!important;
                padding-right: 24px!important;
                .modal-close-button{
                  .svg-close{
                    width: 18px;
                  }
                }
              }
            }
            .ReactModal__Overlay--after-open{
              z-index: 3;
            }
        `}
      </style>
    );
  }
  const {
    state: { businessInfo, currentUser, mileagePoint },
  } = useAuthContext();
  const { id: businessId } = businessInfo || {
    id: null,
  };
  const { referralCode } = currentUser || {
    referralCode: null,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);
  const [isOpenSharePopover, setIsOpenSharePopover] = useState(false);
  const { coords, elmRef, handleGetElementCoords } = useGetElementCoords();
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleToggleSharePopover = e => {
    setIsOpenSharePopover(s => !s);
    handleGetElementCoords(e);
  };

  function openModalShare() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // query: partner list registed Data
  const { data } = useQuery(
    [`v1/business/${businessId}/partners/all`],
    () => {
      return getAllPartnersByBusinessIdFn(businessId);
    },
    {
      enabled: Boolean(businessId),
    },
  );

  // ACTION : delete partner
  const deletePartnerMutaion = useMutation({
    mutationFn: partnerId => deletePartnerFn({ businessId, partnerId }),
    onSuccess: () => {
      alert('파트너 삭제에 성공했습니다.');
      window.location.reload();
    },
    onError: error => {
      console.log(error);
      alert('파트너 삭제에 실패했습니다.');
    },
  });

  // query: order amount of current month Data
  const { data: dataAmountCurrentMonth } = useQuery(
    [`v1/order/compute/sum-current-month`],
    () => {
      return getOrderAmountCurrentMonthFn();
    },
  );
  const amountCurrentMonth = dataAmountCurrentMonth?.message;

  // query: order amount of current month Data
  const { data: dataAmountLastMonth } = useQuery(
    [`v1/order/compute/sum-last-month`],
    () => {
      return getOrderAmountLastMonthFn();
    },
  );
  const amountLastMonth = dataAmountLastMonth?.message;

  const partnersList = data?.list || [];

  const totalAmountOrder = partnersList?.reduce(
    (prev, cur) => cur.sumAmountOrders + prev,
    0,
  );

  const calculateAccrualRate = () => {
    if (amountLastMonth < 200000) {
      return 0;
    }
    if (amountLastMonth >= 200000 && amountLastMonth < 500000) {
      return 1;
    }
    if (amountLastMonth >= 500000 && amountLastMonth < 1000000) {
      return 3;
    }
    if (amountLastMonth > 1000000) {
      return 5;
    }
    return 0;
  };

  const totalSaveMileagePoints = partnersList?.reduce(
    (prev, cur) => (cur.sumAmountOrders / 100) * calculateAccrualRate() + prev,
    0,
  );

  const deletePartner = partnerId => {
    // todo: 파트너 삭제 API
    if (window.confirm('파트너를 삭제하시겠습니까?')) {
      deletePartnerMutaion.mutate(partnerId);
    }
  };

  const handleCopyReferralCode = (event, value) => {
    event.preventDefault();
    alert('링크가 복사 되었습니다.');
    // const key = enqueueSnackbar('링크가 복사 되었습니다.', {
    //   variant: 'success',
    // });

    copyLink(value);

    // setTimeout(() => {
    //   closeSnackbar(key);
    // }, 500);
  };

  const handleCopyKakaotalk = (event, value) => {
    event.preventDefault();
    if (!window.Kakao) return;
    // 카카오 연결
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(REACT_APP_KAKAO_ID);
    }
    window.Kakao.Share.sendDefault({
      installTalk: true,
      objectType: 'text',
      text: `안녕하세요.\n파트너 코드가 공유되었습니다.\n파트너 코드: ${businessInfo.businessPhone}\n회원가입 링크: https://keyin.app/sign-up/representative?recommendation=${businessInfo.businessPhone}`,
      link: {
        // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
        mobileWebUrl: 'https://keyin.app',
        webUrl: 'https://keyin.app',
      },
      buttons: [
        {
          title: '홈페이지',
          link: {
            webUrl: 'https://keyin.app',
            mobileWebUrl: 'https://keyin.app',
          },
        },
      ],
    });
  };

  return (
    <div className="partner-content">
      <Style />
      <div className="my-page-content-container partner-content-1 !max-w-[unset]">
        <div className="partner-content-1-left">
          <div className="content-left">
            <div className="title">나의 주문 실적</div>
            <div className="orange">
              <span>{formatNumber(amountCurrentMonth)}</span>원
            </div>
          </div>
          <div className="content-right">
            <div className="title">전월 주문 실적</div>
            <div className="number">
              <span>{formatNumber(amountLastMonth)}</span>원
            </div>
          </div>
        </div>
        <div className="partner-content-1-right">
          <div className="title">
            마일리지 적립률
            <img
              // className="pc-only"
              alt="information"
              src="/assets/app/information.svg"
            />
            <div className="information-pop-up">
              <ul>
                <li>
                  <span>본인 실적 20만원(월) 달성 : 1% 적용</span>
                </li>
                <li>
                  <span>본인 실적 50만원(월) 달성 : 3% 적용</span>
                </li>
                <li>
                  <span>본인 실적 100만원(월) 달성 : 5% 적용</span>
                </li>
              </ul>
            </div>
            <div className="percent">
              {calculateAccrualRate()}
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-page-content-container partner-content-2 !max-w-[unset]">
        <div className="partner-content-2-title">
          <div className="title-1">내 파트너 현황</div>
          {/* <button
            className="openModalBtn"
            onClick={() => {
              setIsOpenRegisterModal(true);
            }}
          >
            파트너 등록
          </button> */}
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th style={{ color: 'black', paddingTop: 0 }}>삭제</th>
                <th style={{ color: 'black', paddingTop: 0 }}>업체명</th>
                <th style={{ color: 'black', paddingTop: 0 }}>대표자</th>
                <th style={{ color: 'black', paddingTop: 0 }}>주문실적</th>
                {window.innerWidth <= 600 ? (
                  <th style={{ color: 'black', paddingTop: 0 }}>마일리지</th>
                ) : (
                  <th style={{ color: 'black', paddingTop: 0 }}>
                    적립 마일리지
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {partnersList?.length > 0 &&
                partnersList.map(item => {
                  const {
                    businessName,
                    businessRepresentativeName,
                    saveMileagePoints,
                    sumAmountOrders,
                    partnerShipID,
                  } = item;
                  return (
                    <tr key={generateUId()}>
                      <td>
                        <button
                          style={{
                            padding: '0',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            deletePartner(partnerShipID);
                          }}
                          className="partner-delete-button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="svg-close"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.121 3 3 5.121l7.071 7.072-7.07 7.07 2.12 2.122 7.072-7.071 7.07 7.07 2.122-2.12-7.071-7.071 7.071-7.071L19.264 3l-7.071 7.071L5.12 3z"
                              fill="#333333"
                            />
                          </svg>
                        </button>
                      </td>
                      <td>{businessName}</td>
                      <td className="text-line-2">
                        {businessRepresentativeName}
                      </td>
                      <td>
                        {formatNumber(sumAmountOrders)}
                        <span style={{ fontFamily: 'Noto Sans KR' }}>원</span>
                      </td>
                      <td className="nummber-p">
                        {formatNumber(
                          (sumAmountOrders / 100) * calculateAccrualRate(),
                        )}
                        P
                      </td>
                    </tr>
                  );
                })}
              {window.innerWidth < 768 ? (
                <tr>
                  <td
                    style={{
                      backgroundColor: '#000000',
                      paddingBottom: '2px',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                    }}
                    colSpan={4}
                  >
                    파트너 합계
                  </td>
                  <td>
                    <div className="number">
                      {formatNumber(totalSaveMileagePoints)}P
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    style={{ backgroundColor: '#000000', paddingBottom: '3px' }}
                    colSpan={2}
                  >
                    파트너 합계
                  </td>
                  <td style={{ backgroundColor: '#000000' }}>
                    <div>
                      <img
                        className="pc-only"
                        alt="sum"
                        src="/assets/app/sum-dark.svg"
                      />
                    </div>
                  </td>
                  <td style={{ backgroundColor: '#000000' }}>
                    {formatNumber(totalAmountOrder)}
                  </td>
                  <td>
                    <div className="number">
                      {formatNumber(totalSaveMileagePoints)}P
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="partner-content-3 !max-w-[unset]">
        <div className="my-page-content-container !max-w-[unset]">
          <div className="partner-content-3-title">
            이번 달 적립 예정 마일리지 포인트
          </div>
          {/* <div className="mileage-points">{formatNumber(mileagePoint)}P</div> */}
          <div className="mileage-points">
            {formatNumber(totalSaveMileagePoints)}P
          </div>
        </div>
        <div className="my-page-content-container !max-w-[unset]">
          <div className="partner-content-3-title">파트너 등록 코드</div>
          <div className="share-container">
            <button className="pc-only" onClick={handleToggleSharePopover}>
              <span>공유하기</span>
              <img alt="share" src="/assets/app/share-dark.svg" />
            </button>
            <button className="mo-only" onClick={openModalShare}>
              <img alt="share" src="/assets/app/share-m.png" />
            </button>
            <div className="number">{referralCode}</div>
          </div>
        </div>
      </div>
      {isOpenRegisterModal && (
        <RegisterMyPartnerModal
          isOpen={isOpenRegisterModal}
          onClose={() => setIsOpenRegisterModal(false)}
          partnerIds={partnersList?.map(item => item?.partnerShipID ?? 0)}
        />
      )}
      {isOpenSharePopover && (
        <Popover coords={coords} position="right">
          <SharePopoverContent
            onClose={handleToggleSharePopover}
            handleCopyKakaotalk={handleCopyKakaotalk}
          />
        </Popover>
      )}

      <ModalComponent
        isOpen={isOpen}
        closeModal={closeModal}
        className={`modal-share${isOpen ? ` white-header` : ``}`}
        closeColor="#FFFFFF"
      >
        <div className="my-page-m-share">
          <div>
            <span>공유하기</span>
          </div>
          <div className="action-share">
            <div>
              <button
                className="kakaotalk"
                onClick={event => handleCopyKakaotalk(event, '')}
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40" cy="40" r="35" fill="#FEE500" />
                  <g clipPath="url(#d6tskuj0ia)">
                    <path
                      d="M40.5 24C30.835 24 23 30.163 23 37.77c0 4.95 3.318 9.287 8.3 11.715a719.914 719.914 0 0 0-1.516 5.69c-.238.946.347.933.733.68.301-.2 4.795-3.243 6.735-4.555a22.38 22.38 0 0 0 3.248.237c9.665 0 17.5-6.163 17.5-13.767C58 30.166 50.165 24 40.5 24z"
                      fill="#371D1E"
                    />
                  </g>
                  <defs>
                    <clipPath id="d6tskuj0ia">
                      <path
                        fill="#fff"
                        transform="translate(23 24)"
                        d="M0 0h35v32H0z"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span>카카오톡</span>
              </button>
            </div>
            <div>
              <button
                className="link"
                onClick={event =>
                  handleCopyReferralCode(
                    event,
                    `${SIGN_UP_REPRESENTATIVE}?referralCode=${referralCode}`,
                  )
                }
              >
                {/* <img src="/assets/icons/link.svg" alt="" /> */}
                <svg
                  width="69.6"
                  height="69.6"
                  viewBox="0 0 81 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40.164" cy="40" r="40" fill="#fff" />
                  <path
                    d="M34.556 37.258c.078-2.384 1.007-4.365 2.626-6.021 2.23-2.285 4.448-4.589 6.78-6.768 4.792-4.478 12.493-2.286 14.065 3.983.703 2.804.192 5.445-1.78 7.591-2.278 2.482-4.713 4.821-7.101 7.202a1.507 1.507 0 0 1-2.168.002c-.601-.605-.587-1.53.079-2.2 2.211-2.23 4.453-4.43 6.652-6.67 1.595-1.626 1.98-3.922 1.077-5.992-1.484-3.403-6.027-4.347-8.694-1.764a352.854 352.854 0 0 0-6.857 6.845c-2.472 2.531-1.948 6.564 1.06 8.439.474.294.881.622.979 1.199.103.613-.077 1.139-.6 1.5-.553.381-1.14.381-1.716.048-1.885-1.09-3.214-2.654-3.856-4.737-.265-.86-.369-1.77-.546-2.656v-.002z"
                    fill="#000"
                  />
                  <path
                    d="M45.873 43.14c-.049 2.34-.967 4.29-2.553 5.92-2.225 2.29-4.437 4.598-6.777 6.767-5.18 4.8-12.411 1.895-14.026-3.629-.86-2.943-.328-5.698 1.748-7.983 1.94-2.137 4.042-4.128 6.073-6.182.301-.304.6-.611.91-.906.668-.636 1.551-.654 2.153-.054.609.608.623 1.562-.009 2.21-.995 1.022-2.014 2.02-3.023 3.03-1.21 1.21-2.445 2.398-3.627 3.637-2.625 2.754-1.9 7.01 1.465 8.714 1.925.974 4.438.701 5.99-.797 2.45-2.365 4.885-4.753 7.22-7.23 2.39-2.537 1.57-6.68-1.569-8.376-.538-.292-.94-.643-1.007-1.276-.06-.574.112-1.066.597-1.401.552-.383 1.147-.364 1.723-.063 2.163 1.13 3.633 2.851 4.289 5.207.218.782.286 1.606.422 2.412h.002z"
                    fill="#000"
                  />
                </svg>

                <span>링크복사</span>
              </button>
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
