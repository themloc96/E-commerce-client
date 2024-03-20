import { useState, useMemo, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useNavigate } from 'react-router-dom';

// notistack
import { useSnackbar } from 'notistack';

// swiper
import { Autoplay } from 'swiper';
import 'swiper/swiper.css';

// styles
import orderStyles from '../../styles/main/order.module.scss';

// contexts
import { useAuthContext } from '../../contexts/AuthProvider';

// API
import { getBestProductsFn } from '../../apis/product.api';
import { getListBannerFn } from '../../apis/banner.api';

// util
import {
  calculatePercentageOfPrice,
  formatNumber,
  generateNameId,
  setOnErrorImage,
  copyLink,
  formatCost,
  downloadFile,
} from '../../utils/helpers';

// component
import ModalComponent from '../../components/core/modal-base';
import LoadingBox from '../../components/Loading/LoadingBox';
import PartnersSection from './components/PartnersSection';
import {
  SIGN_UP_REPRESENTATIVE,
  MY_PAGE,
} from '../../components/routes/Routes';

// hooks
import { useWindowDimensions } from '../../hooks';

// constant
import { bannerPosition, businessType } from '../../constants';
import { sendConsultationFn } from '../../apis/partner.api';

import { REACT_APP_KAKAO_ID } from '../../constants/AppConfig';
import { getStatusList } from '../../apis/asService.api';

function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);
  const [totalSlide, setTotalSlide] = useState(0);
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser, businessInfo, mileagePoint } = state;
  const isCheckBusinessType =
    businessInfo?.businessType === businessType.GENERAL ||
    businessInfo?.businessType === businessType.AS;
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const STALETIME_MS = 3000;
  const kakaoShare = '599095fbff6e4f59f33b8cbbd9884988';
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleShare = event => {
    event.preventDefault();
    openModal();
  };

  const handleSharePopover = event => {
    event.preventDefault();
    setIsOpenPopover(true);
  };

  const handleCloseSharePopoper = event => {
    event.preventDefault();
    setIsOpenPopover(false);
  };

  const handleNextSlice = event => {
    event.preventDefault();
    const { swiper } = document.querySelector('.swiper');

    // Now you can use all slider methods like
    swiper.slideNext();
  };

  const handlePreSlice = event => {
    event.preventDefault();
    const { swiper } = document.querySelector('.swiper');

    // Now you can use all slider methods like
    swiper.slidePrev();
  };

  const handleSlideChange = event => {
    const slides = event?.slides?.length;
    // setActiveSlide(event.activeIndex + 1);
    setActiveSlide((event.realIndex % slides) + 1);
  };

  const formatNumberPage = value => {
    return value < 10 ? `0${value.toString()}` : value.toString();
  };

  const handleSlideInit = event => {
    setTotalSlide(event?.slides?.length);
  };

  const mutation = useMutation(sendConsultationFn, {
    onSuccess: data => {
      alert('상담 신청이 완료되었습니다. 담당자 확인 후 연락드리겠습니다.');
    },
    onError: data => {
      alert('오류가 발생하였습니다.');
    },
  });

  const handleConsultationApplication = event => {
    event.preventDefault();
    mutation.mutate();
  };

  // #region
  // query: best product list Data
  const { data, isLoading } = useQuery([`v1/order/calculate/list`], () => {
    return getBestProductsFn();
  });
  const { list: bestProducts } = data || {
    list: [],
  };

  const { data: dataBanner, isLoading: isLoadingBanner } = useQuery(
    [`v1/banner/list?PAGE=0`],
    () => {
      return getListBannerFn({ page: 0 });
    },
    {
      // enabled: Boolean(businessInfo?.id),
      retry: 0,
    },
  );
  // #endregion
  function PaginationButton() {
    return (
      <div className={orderStyles.pagination}>
        <div
          className={`container keyin-container ${orderStyles['pagination-container']}`}
        >
          <div className={orderStyles['paging-count']}>
            <button onClick={handlePreSlice}>
              <svg
                width="21"
                height="21"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={orderStyles['paging-count-svg']}
              >
                <path
                  d="m10.75 2-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className={orderStyles['count-number']}>
              {formatNumberPage(activeSlide)}
              <span className={orderStyles.total}>
                {' '}
                / {formatNumberPage(totalSlide)}
              </span>
            </span>
            <button onClick={handleNextSlice}>
              <svg
                width="21"
                height="21"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={orderStyles['paging-count-svg']}
              >
                <path
                  d="m6.25 14 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyReferralCode = (event, value) => {
    event.preventDefault();
    setIsOpenPopover(false);
    copyLink(value);
    alert('링크가 복사 되었습니다.');
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCopyKakaotalk = (event, value) => {
    event.preventDefault();
    if (!window.Kakao) return;
    // 카카오 연결
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoShare);
      console.log(window.Kakao.isInitialized());
    }
    window.Kakao.Share.sendDefault({
      installTalk: true,
      objectType: 'text',
      text: `안녕하세요.\n추천인 코드가 공유되었습니다.\n추천인 코드: ${businessInfo.businessPhone}\n회원가입 링크: https://keyin.app/sign-up/representative?recommendation=${businessInfo.businessPhone}`,
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

  const handlePartner = (event, value) => {
    event.preventDefault();
    if (
      businessInfo?.businessType !== businessType.AGENCY &&
      businessInfo?.businessType !== businessType.AS &&
      businessInfo?.businessType !== businessType.AS_AGENCY
    ) {
      alert('대리점 계약 이후 사용가능한 메뉴입니다.');
    } else {
      navigate('/my-page#partner');
    }
  };

  const handleCustomer = () => {
    navigate('/my-page#customer');
  };

  const listBanner = useMemo(() => {
    if (width > 768) {
      return (
        dataBanner?.data?.list.filter(
          banner => banner.position === bannerPosition.PC && banner.use !== '1',
        ) || []
      );
    }
    return (
      dataBanner?.data?.list.filter(
        banner => banner.position === bannerPosition.MO && banner.use !== '1',
      ) || []
    );
  }, [dataBanner, width]);

  useEffect(() => {
    setTotalSlide(listBanner?.length);
  }, [listBanner]);

  window.addEventListener('popstate', () => {
    window.location.reload();
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { data: listStatus } = useQuery(
    ['getStatusList'],
    () =>
      getStatusList(
        { year: currentYear, month: currentMonth },
        currentUser?.id,
      ),
    {
      enabled: currentUser !== null,
      staleTime: STALETIME_MS,
      retry: 0,
      onSuccess: () => {},
    },
  );

  return (
    <div>
      <Style />
      {isLoadingBanner && <LoadingBox />}
      {!isLoadingBanner && listBanner.length > 0 ? (
        <Swiper
          className={orderStyles['keyin-slider']}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          onSlideChange={handleSlideChange}
          onInit={handleSlideInit}
          slideToClickedSlide
          loop
        >
          <PaginationButton />
          {listBanner.map(item => {
            return (
              <SwiperSlide
                key={item.id}
                style={{ backgroundColor: item.color }}
                onClick={() => {
                  if (item?.url !== '') {
                    if (!item?.url.startsWith('https://')) {
                      window.open(`https://${item?.url}`, '_blank').focus();
                    } else {
                      window.open(item?.url, '_blank').focus();
                    }
                  }
                }}
              >
                <div className={orderStyles['swiper-wrap']}>
                  <img style={{width: 'auto'}} src={item.image} id="bg" alt={item.title} />
                  <div className={orderStyles.title}>
                    <div className={orderStyles['keyin-s']}>
                      {/* <span>닫으면 즉시 잠기는</span> */}
                      {/* <span>{item.title || ""}</span> */}
                      {/* <span className={orderStyles['font-bold']}>
                          키인S 즉시잠김 도어락
                        </span> */}
                    </div>
                    {/* <div className={orderStyles['keyin-desc']}>
                        <span>
                          <span>스크래치 등 외부환경에서도</span>{' '}
                          <span>
                            변하지 않는 디자인 가치를
                            <span className={orderStyles['letter-space']}> 선</span>
                            사합니다
                          </span>
                        </span>
                      </div> */}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className={orderStyles['keyin-slider']}>
          <div>
            <div className={orderStyles['swiper-wrap']}>
              {/* <img src={item.image} id="bg" alt="" /> */}
              <div className={orderStyles.title}>
                <div className={orderStyles['keyin-s']}>
                  <span> </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`container keyin-container ${orderStyles.container}`}>
        <div className={orderStyles['keyin-component']}>
          <Link to="/order/keyin-smart-lock" className={orderStyles.component}>
            <img src="/assets/icons/order.svg" alt="" />
            <span>상품주문</span>
          </Link>
          <Link to="/my-page#calculate" className={orderStyles.component}>
            <img src="/assets/icons/settlement.svg" alt="" />
            <span>정산하기</span>
          </Link>
          <Link
            className={orderStyles.component}
            onClick={event => {
              handlePartner(event);
            }}
          >
            <img src="/assets/icons/partner.svg" alt="" />
            <span>파트너관리</span>
          </Link>
          <button
            className={orderStyles.component}
            onClick={() => handleCustomer()}
          >
            <Link>
              <img src="/assets/icons/customer.svg" alt="" />
              <span>고객관리</span>
            </Link>
          </button>
        </div>
        <div className={orderStyles['keyin-info']}>
          <div className={orderStyles.title}>
            <div className={`${orderStyles.badge}`}>
              <Link to="/mileage">
                {/* <div className={orderStyles['keyin-ellipse']}>P</div> */}
                <div className={orderStyles['keyin-ellipse']}>
                  <img src="/assets/icons/point.svg" alt="" />
                </div>
                <span className={orderStyles.text}>보유 포인트</span>
                <div className={orderStyles.code}>
                  <span className={orderStyles.number}>
                    {formatNumber(mileagePoint)}
                  </span>
                </div>
              </Link>
            </div>
            <hr />
            <div className={orderStyles.total}>
              <div className={orderStyles['code-text']}>
                <span
                  className={orderStyles.text}
                  style={{ wordBreak: 'keep-all' }}
                >
                  추천인 코드
                </span>
              </div>
              <span className={orderStyles['referral-code']}>
                {currentUser?.referralCode || '0'}
              </span>
              <button
                className={orderStyles.share}
                onClick={handleSharePopover}
              >
                공유하기
                <img src="/assets/icons/share-w.svg" alt="" />
              </button>
            </div>
            <div
              className={orderStyles['popover-share']}
              style={
                isOpenPopover === true
                  ? { display: 'flex' }
                  : { display: 'none' }
              }
            >
              <div className={orderStyles['popover-header']}>
                <button
                  style={{
                    padding: '0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={handleCloseSharePopoper}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-close"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.121 3 3 5.121l7.071 7.072-7.07 7.07 2.12 2.122 7.072-7.071 7.07 7.07 2.122-2.12-7.071-7.071 7.071-7.071L19.264 3l-7.071 7.071L5.12 3z"
                      fill="#1C1C1C"
                    />
                  </svg>
                </button>
              </div>
              <div className={orderStyles['popover-title']}>
                <span>공유하기</span>
              </div>
              <div className={orderStyles['action-share']}>
                <div>
                  <button
                    className={orderStyles.kakaotalk}
                    onClick={event => {
                      handleCopyKakaotalk(event, '');
                      handleCloseSharePopoper(event);
                    }}
                  >
                    <svg
                      width="95"
                      height="95"
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
                    className={orderStyles.link}
                    onClick={event =>
                      handleCopyReferralCode(
                        event,
                        `${SIGN_UP_REPRESENTATIVE}?referralCode=${currentUser?.referralCode}`,
                      )
                    }
                  >
                    {/* <img src="/assets/icons/link.svg" alt="" /> */}
                    <svg
                      width="79.6"
                      height="79.6"
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
          </div>
          <div className={orderStyles['title-mobile']}>
            <Link to="/mileage">
              <div className={`keyin-point-badge ${orderStyles.badge}`}>
                <span className={orderStyles.text}>보유 포인트</span>
              </div>
              <div className={orderStyles.code}>
                <span className={orderStyles.number}>
                  {formatNumber(mileagePoint)}
                </span>
                {/* <div className={orderStyles['keyin-ellipse']}>P</div> */}
                <div className={orderStyles['keyin-ellipse']}>
                  <img src="/assets/icons/point.svg" alt="" />
                </div>
              </div>
            </Link>
          </div>
          <div className={orderStyles['total-mobile']}>
            <div className={orderStyles.badge}>
              <span className={orderStyles.text}>추천인 코드</span>
            </div>
            <div className={orderStyles.code}>
              <span>{currentUser?.referralCode || 0}</span>
              <button className={orderStyles.share} onClick={handleShare}>
                <img src="/assets/icons/share.svg" alt="" />
              </button>
            </div>
          </div>
          {/* Since this is not the scope of development, the customer requested blind processing. */}
          {currentUser?.businessType === 'AS_AGENCY' &&
            (currentUser?.asengineer ||
              currentUser?.memberType === 'ACCOUNT' ||
              currentUser?.previousMemberType === 'ACCOUNT') && (
              <>
                <div className={orderStyles['keyin-as']}>
                  <span>A/S 현황</span>
                  <img src="/assets/logos/bk.svg" alt="" />
                </div>
                <div className={orderStyles['keyin-tag']}>
                  <button
                    className={orderStyles['tag-app']}
                    onClick={() =>
                      navigate(
                        `/as/status?year=${currentYear}&month=${currentMonth}`,
                      )
                    }
                  >
                    <span>접수 건수</span>
                    <span>
                      <span className={orderStyles.number}>
                        {listStatus?.ASCount}
                      </span>
                    </span>
                    <span>건</span>
                  </button>
                  <button
                    className={orderStyles['tag-action-result']}
                    onClick={() =>
                      navigate(
                        `/as/status?year=${currentYear}&month=${currentMonth}`,
                      )
                    }
                  >
                    <span>
                      {window.innerWidth <= 400
                        ? '조치결과 입력 필요'
                        : '조치 결과 입력 필요'}
                    </span>
                    <span>
                      <span className={orderStyles.number}>
                        {listStatus?.ASStatusAADCount}
                      </span>
                    </span>
                    <span>건</span>
                  </button>
                  <button
                    className={orderStyles['tag-as-action']}
                    onClick={() =>
                      navigate(
                        `/as/status?year=${currentYear}&month=${currentMonth}`,
                      )
                    }
                  >
                    <span>
                      {window.innerWidth <= 400
                        ? 'A/S 조치 완료'
                        : 'A/S 조치 완료'}
                    </span>
                    <span>
                      <span className={orderStyles.number}>
                        {listStatus?.ASStatusAFCount}
                      </span>
                    </span>
                    <span>건</span>
                  </button>
                </div>
              </>
            )}

          {/* End blind */}

          <PartnersSection />
          {isLoading && <LoadingBox />}
          {!isLoading &&
            bestProducts.filter(item => item.id !== 0 && item.public === true)
              .length > 0 && (
              <div className={orderStyles['keyin-best']}>
                <div className={orderStyles.status}>
                  <span>
                    최신 <span>상품</span>
                  </span>
                  <img src="/assets/logos/bk.svg" alt="" />
                </div>
                <Link to="/order/keyin-smart-lock" className={orderStyles.view}>
                  전체보기
                  <img src="/assets/arrow/right-dark.svg" alt="" />
                </Link>
              </div>
            )}
          {!isLoading &&
            bestProducts.filter(item => item.id !== 0 && item.public === true)
              .length > 0 && (
              <div className={orderStyles['keyin-list-best']}>
                <Swiper
                  slidesPerView={2}
                  spaceBetween={12}
                  breakpoints={{
                    700: {
                      slidesPerView: 3,
                      spaceBetween: 15,
                    },
                    601: {
                      slidesPerView: 3,
                      spaceBetween: 8,
                    },
                    900: {
                      slidesPerView: 4,
                      spaceBetween: 15,
                    },
                  }}
                  loop={false}
                  // loopFillGroupWithBlank
                  freeMode
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                >
                  {bestProducts
                    .filter(item => item.id !== 0 && item.public === true)
                    .map(item => {
                      const {
                        modelName,
                        name,
                        price,
                        wholeSalePrice,
                        mileageAccumulationRate,
                        id,
                        productFiles,
                      } = item;
                      const thumbnail = item.productThumbnail
                        ? item.productThumbnail
                        : '/assets/products/no-image.png';
                      return (
                        <SwiperSlide key={id}>
                          <div className={orderStyles.card}>
                            <Link
                              to={`/product/${generateNameId({ name, id })}`}
                            >
                              {/* <img
                            src={
                              window.innerWidth <= 400
                                ? '/assets/products/smart-lock-m.svg'
                                : '/assets/products/smart-lock.png'
                            }
                            alt=""
                          /> */}
                              <img
                                id={`product-${id}`}
                                src={thumbnail}
                                alt={name}
                                onError={() => setOnErrorImage(`product-${id}`)}
                              />
                              <div className={orderStyles['products-info']}>
                                <div className={orderStyles.info}>
                                  <span style={{ lineHeight: '2' }}>
                                    {name.length < 20
                                      ? name
                                      : `${name.substring(0, 20)}...`}
                                  </span>
                                </div>
                                <span className={orderStyles.number}>
                                  {/* {formatNumber(price)} */}
                                  {/* ZILT-1775 */}
                                  {/* case 1. In the case of general business classification 
                                  expose the general member unit price.
                              */}
                                  {/* case 2. If the classification of business is an agency.
                                  the wholesale member unit price be exposed
                              */}
                                  {formatNumber(
                                    businessInfo?.businessType ===
                                      businessType.GENERAL
                                      ? price + Math.round(item.price_vat)
                                      : wholeSalePrice +
                                          Math.round(item.wholeSalePrice_vat),
                                  )}
                                  <span>원</span>
                                </span>
                                <hr />
                                <span className={orderStyles['products-desc']}>
                                  <span className={orderStyles.number}>
                                    {mileageAccumulationRate}
                                  </span>
                                  <span className={orderStyles.percent}>
                                    %{' '}
                                  </span>
                                  {window.innerWidth <= 400
                                    ? '적립'
                                    : '마일리지 적립'}
                                  <span className={orderStyles.cost}>
                                    {price
                                      ? formatCost(
                                          calculatePercentageOfPrice(
                                            mileageAccumulationRate,
                                            isCheckBusinessType
                                              ? price +
                                                  Math.round(item.price_vat)
                                              : wholeSalePrice +
                                                  Math.round(
                                                    item.wholeSalePrice_vat,
                                                  ),
                                          ),
                                        )
                                      : 0}
                                  </span>
                                  원
                                </span>
                              </div>
                            </Link>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            )}
        </div>
      </div>

      <div className={orderStyles['container-footer']}>
        <div className="container keyin-container">
          {/* Since this is not the scope of development, the customer requested blind processing. */}
          <div
            className={orderStyles['keyin-interview']}
            style={{ display: 'none' }}
          >
            <div className={orderStyles.status}>
              <span>이달의 인터뷰</span>
              <img src="/assets/logos/bk.svg" alt="" />
            </div>
            <Link to="/main" className={orderStyles.view}>
              전체보기
              <img src="/assets/arrow/right-dark.svg" alt="" />
            </Link>
          </div>
          <div
            className={orderStyles['keyin-interview-list']}
            style={{ display: 'none' }}
          >
            <Swiper
              slidesPerView={2}
              spaceBetween={12}
              breakpoints={{
                700: {
                  slidesPerView: 3,
                  spaceBetween: 11,
                },
                601: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
              }}
            >
              <SwiperSlide>
                <div className={orderStyles.card}>
                  <img
                    src={
                      window.innerWidth <= 400
                        ? '/assets/interview/interview-m.svg'
                        : '/assets/interview/interview-1.png'
                    }
                    alt=""
                  />
                  <div className={orderStyles['products-info']}>
                    <div className={orderStyles.frame}>
                      <span>이달의 인터뷰</span>
                    </div>
                    <div className={orderStyles.desc}>
                      <span>
                        {window.innerWidth <= 400
                          ? '최고의 수익률을 내는 방법3'
                          : '최고의 수익률을 내는 방법 3 최고의 수익률을 내는 방법 3 최고의 수익률을 내는 방법 3 최고...'}
                      </span>
                    </div>
                    <div className={orderStyles.date}>
                      <span>2023.03.27</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={orderStyles.card}>
                  <img
                    src={
                      window.innerWidth <= 400
                        ? '/assets/interview/interview-m.svg'
                        : '/assets/interview/interview-2.png'
                    }
                    alt=""
                  />
                  <div className={orderStyles['products-info']}>
                    <div className={orderStyles.frame}>
                      <span>이달의 인터뷰</span>
                    </div>
                    <div className={orderStyles.desc}>
                      <span>
                        {window.innerWidth <= 400
                          ? '최고의 수익률을 내는 방법3'
                          : '최고의 수익률을 내는 방법 3 최고의 수익률을 내는 방법 3 최고의 수익률을 내는 방법 3 최고...'}
                      </span>
                    </div>
                    <div className={orderStyles.date}>
                      <span>2023.03.27</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={orderStyles.card}>
                  <img
                    src={
                      window.innerWidth <= 400
                        ? '/assets/interview/interview-m.svg'
                        : '/assets/interview/interview-3.png'
                    }
                    alt=""
                  />
                  <div className={orderStyles['products-info']}>
                    <div className={orderStyles.frame}>
                      <span>이달의 인터뷰</span>
                    </div>
                    <div className={orderStyles.desc}>
                      <span>
                        {window.innerWidth <= 400
                          ? '최고의 수익률을 내는 방법3'
                          : '최고의 수익률을 내는 방법 3 최고의 수익률을 내는 방법 3 최고의 수익률을 내는 방법 3 최고...'}
                      </span>
                    </div>
                    <div className={orderStyles.date}>
                      <span>2023.03.27</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div
            className={orderStyles['keyin-story']}
            style={{ display: 'none' }}
          >
            <div className={orderStyles.left}>
              <span>라오나크 이야기</span>
              <img src="/assets/logos/bk.svg" alt="" />
            </div>
            <div className={orderStyles.right}>
              <div className={orderStyles.action}>
                <Link to="/main" className={orderStyles.view}>
                  전체보기
                  <img src="/assets/arrow/right-dark.svg" alt="" />
                </Link>
              </div>
              <div className={orderStyles.list}>
                <div className={orderStyles['keyin-li']}>
                  <div className={orderStyles.frame}>
                    <div>
                      <span>신제품</span>
                    </div>
                  </div>
                  <div className={orderStyles.text}>
                    <span>[공지] 키인S 와디즈 런칭 안내</span>
                  </div>
                  <div className={orderStyles.action}>
                    <button>
                      <div className={orderStyles['vector-15']} />
                      <div className={orderStyles['vector-16']} />
                      {/* <img src="/assets/icons/plus.png" alt="" /> */}
                    </button>
                  </div>
                </div>
                <hr />
                <div className={orderStyles['keyin-li']}>
                  <div className={orderStyles.frame}>
                    <div>
                      <span>회사소식</span>
                    </div>
                  </div>
                  <div className={orderStyles.text}>
                    <span>
                      프리미엄 스마트락 브랜드 Keyin, 즉시잠김 도어락 ‘키인S’···
                    </span>
                  </div>
                  <div className={orderStyles.action}>
                    <button>
                      {/* <img src="/assets/icons/plus.png" alt="" /> */}
                      <div className={orderStyles['vector-15']} />
                      <div className={orderStyles['vector-16']} />
                    </button>
                  </div>
                </div>
                <hr />
                <div className={orderStyles['keyin-li']}>
                  <div className={`${orderStyles.frame} ${orderStyles.active}`}>
                    <div>
                      <span>행사안내</span>
                    </div>
                  </div>
                  <div className={orderStyles.text}>
                    <span>라오나크 X 호반건설 디자인 공모전 수상자 발표</span>
                  </div>
                  <div className={orderStyles.action}>
                    <button>
                      {/* <img src="/assets/icons/plus.png" alt="" /> */}
                      <div className={orderStyles['vector-15']} />
                      <div className={orderStyles['vector-16']} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={orderStyles['keyin-story-mobile']}
            style={{ display: 'none' }}
          >
            <div className={orderStyles.top}>
              <div className={orderStyles.status}>
                <span>라오나크 이야기</span>
                <img src="/assets/logos/bk.svg" alt="" />
              </div>
              <button className={orderStyles.view}>
                전체보기
                <img src="/assets/arrow/right-dark.svg" alt="" />
              </button>
            </div>
            <div className={orderStyles.right}>
              <div className={orderStyles.list}>
                <div className={orderStyles['keyin-li']}>
                  <div>
                    <div className={orderStyles.frame}>
                      <div>
                        <span>신제품</span>
                      </div>
                    </div>
                    <div className={orderStyles.action}>
                      <button>
                        <div className={orderStyles['vector-15']} />
                        <div className={orderStyles['vector-16']} />
                        {/* <img src="/assets/icons/plus.png" alt="" /> */}
                      </button>
                    </div>
                  </div>
                  <div className={orderStyles.text}>
                    <span>
                      [공지] 키인S 와디즈 런칭 안내 [공지] 키인S 와디즈 런칭
                      안내[공지] 키인S 와디즈 런칭 안내[공지]...
                    </span>
                  </div>
                </div>
                <hr />
                <div className={orderStyles['keyin-li']}>
                  <div>
                    <div className={orderStyles.frame}>
                      <div>
                        <span>회사소식</span>
                      </div>
                    </div>
                    <div className={orderStyles.action}>
                      <button>
                        <div className={orderStyles['vector-15']} />
                        <div className={orderStyles['vector-16']} />
                        {/* <img src="/assets/icons/plus.png" alt="" /> */}
                      </button>
                    </div>
                  </div>
                  <div className={orderStyles.text}>
                    <span>
                      [공지] 키인S 와디즈 런칭 안내 [공지] 키인S 와디즈 런칭
                      안내[공지] 키인S 와디즈 런칭 안내[공지]...
                    </span>
                  </div>
                </div>
                <hr />
                <div className={orderStyles['keyin-li']}>
                  <div>
                    <div
                      className={`${orderStyles.frame} ${orderStyles.active}`}
                    >
                      <div>
                        <span>행사안내</span>
                      </div>
                    </div>
                    <div className={orderStyles.action}>
                      <button>
                        <div className={orderStyles['vector-15']} />
                        <div className={orderStyles['vector-16']} />
                        {/* <img src="/assets/icons/plus.png" alt="" /> */}
                      </button>
                    </div>
                  </div>
                  <div className={orderStyles.text}>
                    <span>
                      [공지] 키인S 와디즈 런칭 안내 [공지] 키인S 와디즈 런칭
                      안내[공지] 키인S 와디즈 런칭 안내[공지]...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End blind */}

          <div className={orderStyles['keyin-about']}>
            <div className={orderStyles['keyin-contact']}>
              <span>라오나크 계약문의</span>
              <div className={orderStyles.info}>
                <button>
                  <a href="tel:1668-3804">
                    <span>상담전화</span>
                    <span>1668-3804</span>
                  </a>
                </button>
                <hr />
                <button onClick={handleConsultationApplication}>
                  <span className={orderStyles.right}>상담신청</span>
                  <div className={orderStyles['arrow-right']}>
                    <img src="/assets/arrow/right-w.svg" alt="" />
                  </div>
                </button>
              </div>
            </div>
            <button
              onClick={() =>
                downloadFile(
                  'https://keyin.app/assets/introduction/Raonark_Company_Introduction.pdf',
                )
              }
            >
              <div className={orderStyles.about}>
                <span>About 라오나크</span>
                <div className={orderStyles.info}>
                  <span>회사소개서 다운로드</span>
                  <div className={orderStyles.download}>
                    <img src="/assets/icons/download.svg" alt="" />
                  </div>
                </div>
              </div>
            </button>
            <div className={orderStyles['keyin-contact-mobile']}>
              <span>대리점 계약 문의</span>
              <button
                className={orderStyles.info}
                onClick={handleConsultationApplication}
              >
                <span className={orderStyles.right}>상담신청</span>
                <div className={orderStyles['arrow-right']}>
                  <img src="/assets/arrow/right-w.svg" alt="" />
                </div>
              </button>
              <button className={orderStyles.contact}>
                <a type="tel" href="tel:1668-3804">
                  <span className={orderStyles.right}>상담전화</span>
                  <div className={orderStyles.number}>
                    <span>1668-3804</span>
                  </div>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalComponent
        isOpen={isOpen}
        closeModal={closeModal}
        className={`modal-share${isOpen ? ` white-header` : ``}`}
        closeColor="#FFFFFF"
      >
        <div className={orderStyles['m-share']}>
          <div>
            <span>공유하기</span>
          </div>
          <div className={orderStyles['action-share']}>
            <div>
              <button
                className={orderStyles.kakaotalk}
                onClick={event => {
                  handleCopyKakaotalk(event, '');
                  handleCloseSharePopoper(event);
                }}
              >
                {/* <img src="/assets/app/kakaotalk.svg" alt="" /> */}
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
                className={orderStyles.link}
                onClick={event =>
                  handleCopyReferralCode(
                    event,
                    `${SIGN_UP_REPRESENTATIVE}?referralCode=${currentUser?.referralCode}`,
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

export default Page;
