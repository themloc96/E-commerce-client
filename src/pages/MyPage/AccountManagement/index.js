import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import '../../../styles/my-page/accountmanagement.scss';
import ArrowRightIcon from '../../../components/Svg/ArrowRightIcon';

import { useAuthContext } from '../../../contexts/AuthProvider';
import { getDetailModusignFn } from '../../../apis/modusign.api';
import { removeAccessToken } from '../../../utils/accessTokenUtils';
import { getMobileType } from '../../../utils/helpers';
import { withdrawMember } from '../../../apis/members.api';

/**
 * Page
 */

function Page() {
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const { currentUser, businessInfo } = state;
  const [documentId, setDocumentId] = useState('');

  useQuery([documentId], () => getDetailModusignFn({ id: documentId }), {
    enabled: documentId !== '',
    onSuccess: data => {
      window.open(data.embeddedUrl, '_blank');
      setDocumentId('');
    },
    onError: err => {
      console.log(err);
    },
  });

  const withDrawMemberMutation = useMutation({
    mutationFn: memberId => withdrawMember(memberId),
    onSuccess: () => {
      removeAccessToken();
      navigate('/');
    },
  });

  const renderClassificationInformation = () => {
    switch (businessInfo?.businessType) {
      case 'GENERAL':
        return null;
      case 'AGENCY':
        return '대리점';
      case 'AS':
        return 'A/S';
      case 'AS_AGENCY':
        return '대리점, A/S';
      default:
        return null;
    }
  };

  const onClickLogout = () => {
    removeAccessToken();
    navigate('/');
  };

  const onClickWithdrawal = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      withDrawMemberMutation.mutate(currentUser?.id);
    }
  };

  const onClickContractCheck = () => {
    if (getMobileType() === 'android' || getMobileType() === 'iphone') {
      alert('계약서는 PC를 통해 확인 가능합니다.');
    } else if (
      businessInfo &&
      businessInfo.businessDocumentList &&
      businessInfo.businessDocumentList.length !== 0
    ) {
      setDocumentId(businessInfo.businessDocumentList[0].documentID);
    } else {
      alert('대리점 계약 후 버튼을 클릭 해주세요.');
    }
  };

  return (
    <div className="account-management">
      <div>
        <div className="title">
          <h2>
            {/* 사업자 정보<span>대리점, A/S</span> */}
            사업자 정보<span>{renderClassificationInformation()}</span>
          </h2>
        </div>
        <div className="form-account">
          <div className="detail-account">
            <div className="id-account account-info">
              <span>사업자번호</span>
              <span>{businessInfo?.businessRegistrationNumber || ''}</span>
            </div>
            <div className="name-account account-info">
              <span>대표자</span>
              <span>{businessInfo?.businessRepresentativeName || ''}</span>
            </div>
          </div>
          <div className="address-account account-info">
            <span>사업장 주소</span>
            <span>{businessInfo?.businessAddress || ''}</span>
          </div>
          <div className="ex account-info md:!hidden">
            <span>배송 요청사항</span>
            <span>배송 전 연락주세요.</span>
          </div>
          <div className="button-account">
            <div
              tabIndex={0}
              role="button"
              className="btn-01"
              onClick={() => onClickContractCheck()}
            >
              <button type="">대리점 계약 확인</button>
              <ArrowRightIcon />
            </div>
            {currentUser?.signupType === 'HOMEPAGE' && (
              <div
                tabIndex={0}
                role="button"
                className="btn-02"
                onClick={() => navigate('/my-page/check-account-information')}
              >
                <button type="">개인정보 수정</button>
                <ArrowRightIcon />
              </div>
            )}
            <div
              tabIndex={0}
              role="button"
              className="btn-03"
              onClick={() => navigate('/my-page/employee-management')}
            >
              <button type="">직원관리</button>
              <ArrowRightIcon />
            </div>
            <div className="btn-04">
              <span>추천인 코드</span>
              <p>{currentUser?.referralCode || 0}</p>
            </div>
            {currentUser?.businessRegistrationName === 'admin' && (
              <div
                tabIndex={0}
                className="btn-05"
                onClick={() => onClickWithdrawal()}
                role="button"
              >
                <button type="">탈퇴</button>
                <ArrowRightIcon />
              </div>
            )}
          </div>
          <div className="button-logout">
            <button onClick={() => onClickLogout()}>
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
