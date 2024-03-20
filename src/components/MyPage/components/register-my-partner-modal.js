import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { useOnClickOutside } from '../../../hooks';
import '../../../styles/my-page/partnerregistrationpopup.scss';
import { IndCheckbox } from '../../WTable/IndCheckbox';
import {
  verifyBusinessNumberFn,
  verifyReferralCodeFn,
} from '../../../apis/auth.api';
import { getSearchBusinessFn } from '../../../apis/business.api';
import {
  approvalPartnerFn,
  registerPartnerFn,
} from '../../../apis/partner.api';
import { useAuthContext } from '../../../contexts/AuthProvider';
import { getSearchMemberFn } from '../../../apis/members.api';

function RegisterMyPartnerModal({ onClose, partnerIds }) {
  const ref = useRef();
  const {
    state: { businessInfo, currentUser },
  } = useAuthContext();
  const { id: businessId } = businessInfo || {
    id: null,
  };
  const [registeredPartners, setRegisteredPartners] = useState([]);
  // const [isEnableVerify, setIsEnableVerify] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useOnClickOutside(ref, () => onClose());
  // const { enqueueSnackbar } = useSnackbar();
  // const { isError, isSuccess } = useQuery({
  //   queryKey: [
  //     `v1/auth/verify-registration-number/${referralCode}`,
  //     referralCode,
  //   ],
  //   queryFn: () => {
  //     return verifyBusinessNumberFn(referralCode);
  //   },
  //   enabled: isEnableVerify,
  // });

  // query: Table Data
  const { refetch, isFetching: isFetchingSearchMember } = useQuery({
    queryKey: ['searchMemberByReferralCode'],
    queryFn: () => {
      return getSearchMemberFn({
        RETURN_BUSINESS: true,
        REFERRAL_CODE: referralCode,
      });
    },
    enabled: false,
    onSuccess: (data = { data: { list: [] } }) => {
      const {
        id,
        businessName,
        businessRepresentativeName,
        businessType,
        previousBusinessType,
      } = data.data.list[0].business;

      const isExistedInTable = registeredPartners?.some(item => item.id === id);
      console.log(data);
      if (!isExistedInTable && registeredPartners?.length < 5) {
        setRegisteredPartners(prev => [
          ...prev,
          {
            id,
            businessName,
            businessRepresentativeName,
            businessType,
            previousBusinessType,
          },
        ]);
      }
    },
  });

  const {
    isSuccess: isCheckSuccess,
    data: isReferralCodeExisted,
    refetch: checkReferralCode,
    isFetching: isFetchingVerify,
  } = useQuery(
    ['verifyReferralCode', referralCode],
    () => verifyReferralCodeFn(referralCode),
    {
      onSuccess: data => {
        if (data) {
          refetch();
        }
      },
      enabled: false,
    },
  );

  // ACTION : Approval partner
  const approvalPartnerMutaion = useMutation({
    mutationFn: partnerId => approvalPartnerFn({ businessId, partnerId }),
    onSuccess: () => {
      onClose();
      setRegisteredPartners([]);
      window.location.reload();
    },
    onError: error => {
      console.log(error);
      alert('오류가 발생하였습니다.');
      // enqueueSnackbar('Something went wrong!', {
      //   variant: 'error',
      // });
    },
  });

  // ACTION : Register parnter
  const registerPartnerMutaion = useMutation({
    mutationFn: partnerId => registerPartnerFn({ businessId, partnerId }),
    onError: error => {
      switch (error.response.data.message) {
        case 'No Order Amount':
          return alert(
            '주문 실적이 존재하는 대리점에 한하여 파트너 등록이 가능합니다.',
          );
        case 'You cannot register more than 5 people':
          return alert('5명 이상 등록할 수 없습니다.');
        case 'You cannot register more than 10 people':
          return alert('10명 이상 등록할 수 없습니다.');
        case 'You are not allowed to update business info':
          return alert('이미 파트너로 등록된 업체입니다.');
        default:
          return null;
      }
      // enqueueSnackbar('Something went wrong!', {
      //   variant: 'error',
      // });
    },
  });

  const isCheckedAll =
    registeredPartners?.length === 0
      ? false
      : registeredPartners.every(item => item.checked);

  const handleChangeCheckAll = e => {
    const isChecked = e?.target.checked;
    setRegisteredPartners(() =>
      registeredPartners?.map(item => ({ ...item, checked: isChecked })),
    );
  };

  const handleChangeChecked = (e, id) => {
    const isChecked = e?.target?.checked;
    setRegisteredPartners(() =>
      registeredPartners?.map(item => {
        if (item.id === id) {
          return {
            ...item,
            checked: isChecked,
          };
        }
        return item;
      }),
    );
  };
  const handleDeletePartnerChecked = () => {
    const filteredRegisteredPartners = registeredPartners.filter(
      item => !item.checked,
    );
    setRegisteredPartners(filteredRegisteredPartners);
    window.location.reload();
  };

  const handleRegisterPartner = () => {
    try {
      let isOverlap = false;
      registeredPartners?.forEach(item => {
        const {
          checked,
          id,
          businessName,
          businessType,
          previousBusinessType,
        } = item;
        if (checked) {
          if (id === businessId) {
            alert('본인 계정은 파트너 등록이 불가능합니다.');
            throw new Error();
          } else if (
            businessType !== 'AGENCY' &&
            previousBusinessType !== 'AGENCY'
          ) {
            alert(`${businessName}은(는) 대리점으로 지정된 사업장이 아닙니다.`);
            throw new Error();
          } else if (partnerIds.includes(id)) {
            isOverlap = true;
          } else {
            registerPartnerMutaion.mutate(id, {
              onSuccess: () => {
                approvalPartnerMutaion.mutate(id);
              },
            });
          }

          if (isOverlap) {
            alert('이미 파트너로 등록된 업체입니다.');
          }
        }
      });
    } catch (error) {
      console.log('Error Search');
    }
  };

  return createPortal(
    <div className="modal-popup">
      <div className="modal-popup-overplay" />
      <div className="modal-popup-body" ref={ref}>
        <div className="modal-popup-inner">
          <div className="modal-popup-header">
            <div className="modal-popup-title">파트너 등록</div>
            <button onClick={onClose}>
              <svg
                width="28"
                height="28"
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
          <div className="modal-popup-content">
            <div className="modal-popup-input relative">
              <input
                type="text"
                placeholder="파트너 등록 코드 입력해주세요."
                onChange={e => {
                  setReferralCode(e?.target?.value);
                  // setIsEnableVerify(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    checkReferralCode();
                  }
                }}
              />
              {!isReferralCodeExisted && isCheckSuccess && (
                <p className="absolute f12Regular md:f16Regular text-error mt-[10px] ml-[10px] md:ml-[0px] check-referral-error">
                  대리점 계약이 체결된 파트너가 아닙니다.
                </p>
              )}
              {(isFetchingVerify || isFetchingSearchMember) && (
                <p className="absolute f12Regular md:f14Regular mt-[10px] ml-[10px] md:ml-[0px] check-referral-error">
                  loading...
                </p>
              )}
              <button
                onClick={() => checkReferralCode()}
                className="modal-popup-btn-input-pc"
              >
                추가
              </button>
              <button className="modal-popup-btn-input-mo">
                <img
                  alt="btn-search"
                  src="/assets/icons/search.png"
                  onClick={() => checkReferralCode()}
                />
              </button>
            </div>
            <div className="modal-popup-checkbox">
              <div className="modal-popup-title">
                <div className="modal-popup-col-2 pl-[1.5px] pt-[4px] md:pl-[0px] md:pt-[0px]">
                  <IndCheckbox
                    checked={isCheckedAll}
                    onChange={handleChangeCheckAll}
                  />
                </div>
                <div className="modal-popup-col-2 pl-[10px] md:pl-[0px]">
                  No
                </div>
                <div className="modal-popup-col-3 pl-[9px] md:pl-[0px]">
                  업체명
                </div>
                <div className="modal-popup-col-4 pr-[22px] md:pr-[0px]">
                  대표자
                </div>
              </div>
              {registeredPartners?.length > 0 &&
                registeredPartners.map((item, index) => {
                  const {
                    id,
                    businessName,
                    businessRepresentativeName,
                    checked,
                  } = item;
                  return (
                    <div className="modal-popup-check01" key={id}>
                      <div className="modal-popup-col-2 pl-[1.5px] md:pl-[0px]">
                        <IndCheckbox
                          checked={checked}
                          onChange={e => handleChangeChecked(e, id)}
                        />
                      </div>
                      <div className="modal-popup-col-2 pl-[10px] md:pl-[0px]">
                        {index + 1}
                      </div>
                      <div className="modal-popup-col-3 pl-[8px] md:pl-[0px]">
                        {businessName}
                      </div>
                      <div className="modal-popup-col-4 pr-[22px] md:pr-[0px] truncate !inline-block">
                        {businessRepresentativeName}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="modal-popup-button-submit">
              {/* <button
                onClick={handleDeletePartnerChecked}
                className="modal-popup-btn-left"
              >
                삭제
              </button> */}
              <button
                onClick={handleRegisterPartner}
                className="modal-popup-btn-right"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('root'),
  );
}

export default RegisterMyPartnerModal;
