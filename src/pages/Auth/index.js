import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginBox from '../../components/LoginBox';
import '../../styles/login/main.scss';
import ModalComponent from '../../components/core/modal-base';
import '../../styles/login/find-pwd-modal.scss';

// constants
import { loginStatus } from '../../constants';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignUpRepresentActive from './SignUpRepresentActive';
import SignUpEmployee from './SignUpEmployee';
import FindId from './FindId';
import FindPassWord from './FindPassWord';
import LoginPage from './Login';
import loginBoxStyle from './StyleConfig/LoginBoxStyle';
import LineStyle from './StyleConfig/LineStyle';
import { IndCheckbox } from '../../components/WTable/IndCheckbox';
import { getOtpFromLS } from './utils';

function Login(props) {
  const { status = loginStatus.AUTH, title, pageType } = props;
  const [isOpen, setIsOpen] = useState(false);

  // change password
  const [isVerifiedFindPassword, setIsVerifiedFindPassword] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  // sign-up representative
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [openModalPolicy, setOpenModalPolicy] = useState(false);

  const [termTitle, setTermTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('sigUp', true);
  }, []);

  function openModal(open) {
    setIsOpen(open);
  }

  function closeModal(close) {
    setIsOpen(close);
  }

  const renderSignUpSuccess = (type = '') => {
    return (
      <div className="sign-up-container">
        <p className="sign-up-success-text">
          {type === loginStatus.SIGN_UP_REPRESENTATIVE
            ? '관리자 승인 후 로그인이 가능합니다.'
            : '대표자 계정에서 승인 후 로그인이 가능합니다.'}
        </p>
        <Link onClick={() => setSignUpSuccess(false)} to="/login">
          <button className="sign-up-button">확인</button>
        </Link>
      </div>
    );
  };

  const onOpenTerm = (t, open) => {
    setTermTitle(t);
    setOpenModalPolicy(open);
  };

  const handleSigUpSuccess = isSuccess => {
    // const regBrn = /^[0-9]{10}$/;
    // if (
    //   regBrn.test(businessRegistrationNumber) &&
    //   Number(businessRegistrationNumber.slice(0, 3)) > 100
    // ) {
    //   setBrnErr('NO');
    // } else {
    //   setBrnErr('YES'); // temporary
    // }
    /*
    const regEmail = /^\S+@\S+\.\S+$/;
    const regPassword = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    setNewPasswordErr(!regPassword.test(newPasswordValue));
    setComparePassword(newPasswordValue !== confirmNewPassword);
    if (!businessRegistrationNumber) setBrnErr('YES');
    if (!phone && !userName) {
      setErr(true);
    }
    if (!userName) setUserNameErr(true);
    setEmailErr(!regEmail.test(email));

    if ((!phone && !userName) || !regEmail.test(email) || newPasswordErr)
      return;
    */
    setSignUpSuccess(isSuccess);
  };

  const handleChangePasswordSuccess = value => {
    setChangePasswordSuccess(value);
  };

  const handleVerifiedPassWord = value => {
    setIsVerifiedFindPassword(value);
  };

  const content = () => {
    switch (status) {
      case loginStatus.SIGN_IN:
        return <SignIn />;
      case loginStatus.SIGN_UP:
        return <SignUp pageType={pageType} />;
      case loginStatus.SIGN_UP_REPRESENTATIVE:
        if (signUpSuccess) {
          return renderSignUpSuccess(loginStatus.SIGN_UP_REPRESENTATIVE);
        }
        return (
          <SignUpRepresentActive
            onHandleOpenTerm={onOpenTerm}
            onHandleSignUpSuccess={handleSigUpSuccess}
            pageType={pageType}
          />
        );
      case loginStatus.SIGN_UP_EMPLOYEE:
        if (signUpSuccess) {
          return renderSignUpSuccess(loginStatus.SIGN_UP_EMPLOYEE);
        }
        return (
          <SignUpEmployee
            pageType={pageType}
            onHandleOpenTerm={onOpenTerm}
            onHandleSignUpSuccess={handleSigUpSuccess}
          />
        );
      case loginStatus.FIND_ID:
        return <FindId onHandleOpen={openModal} onHandleClose={closeModal} />;
      case loginStatus.FIND_PASSWORD:
        return (
          <FindPassWord
            onHandleChangePasswordSuccess={handleChangePasswordSuccess}
            onHandleVerifiedPassWord={handleVerifiedPassWord}
          />
        );
      default:
        return <LoginPage />;
    }
  };

  const renderTitle = () => {
    if (signUpSuccess)
      return (
        <p style={{ textAlign: 'center' }}>
          <span>회원가입 신청이 </span>
          <span>완료되었습니다.</span>
        </p>
      );
    if (isVerifiedFindPassword) return '비밀번호 변경하기';
    return title;
  };
  const otp = getOtpFromLS();
  return (
    <div className={`login-page${signUpSuccess ? ' sign-up-success' : ''}`}>
      <LoginBox
        status={status}
        title={renderTitle()}
        loginBoxStyle={loginBoxStyle(status, isVerifiedFindPassword)}
        lineStyle={LineStyle(status, isVerifiedFindPassword)}
      >
        {content()}
      </LoginBox>
      <ModalComponent
        isOpen={isOpen}
        closeModal={() => {
          closeModal(false);
          window.location.href = '/login';
        }}
        className="modal-find-password"
      >
        <div className="modal-content find-id-005">
          <p>회원가입시 휴대폰 번호로</p>
          <p>가입 정보가 발송되었습니다.</p>
          <div className="user-id">
            <p className="!ml-[5px] md:!ml-0">{otp?.phone.slice(0, 3)}</p>
            <div className="flex gap-[7px] md:gap-[4px] character-group">
              <p>-</p>
              <div className="flex items-center">
                <span className="h-[11px]">****</span>
              </div>
              <p> -</p>
            </div>
            <p>{otp?.phone.substr(otp.phone.length - 4)}</p>
          </div>
          <div>
            <Link onClick={() => closeModal(false)} to="/login">
              <button className="sign-in-button-005">로그인 하기</button>
            </Link>
            <Link onClick={() => closeModal(false)} to="/find-password">
              <button>비밀번호 찾기</button>
            </Link>
          </div>
        </div>
      </ModalComponent>
      <ModalComponent
        isOpen={changePasswordSuccess}
        closeModal={() => {
          setChangePasswordSuccess(false);
          window.location.href = '/login';
        }}
        className="modal-find-password"
      >
        <div className="modal-content find-password-009">
          <p>
            <span>고객님의 비밀번호가 </span>
            <span>변경되었습니다.</span>
          </p>
          <p>다시 로그인 해주시기 바랍니다.</p>
          <div>
            <Link to="/login">
              <button
                onClick={() => setChangePasswordSuccess(false)}
                className="sign-in-button-find-pass-009"
              >
                <p>로그인하러 가기</p>
              </button>
            </Link>
          </div>
        </div>
      </ModalComponent>
      {/* <ModalComponent
        title={termTitle}
        isOpen={openModalPolicy}
        closeModal={() => setOpenModalPolicy(false)}
        className="policy-modal"
      >
        <div className="policy-content">
          <p className="policy-part-title start-title">1. 회사</p>
          <p style={{ marginBottom: 30 }}>
            본 개인정보처리방침은 주식회사 라오나크에 적용됩니다.
          </p>
          <p style={{ marginBottom: 8 }}>
            당사에 개인정보를 제공하거나 keyin.life 웹사이트 또는
          </p>
          <p>네이버 스마트스토어 웹사이트를 포함합니다.</p>
          <p className="policy-part-title">2. 개인정보 보호 원칙</p>
          <p style={{ marginBottom: 8 }}>
            한국 개인정보보호법 (개인정보보호법) 제 3조는 개인정보를
          </p>
          <p style={{ marginBottom: 30 }}>
            보호를 위한 특정 원칙을 제공합니다.
          </p>
          <p style={{ marginBottom: 8 }}>
            회사는 개인의 개인정보 보호 권리를 존중하며 개인정보 보호법
          </p>
          <p>하에서 개인정보 보호 원칙을 준수하기 위해 노력합니다.</p>
          <p className="policy-part-title">
            3. 개인정보의 수집, 보유, 이용 및제공
          </p>
          <p style={{ marginBottom: 8 }}>
            당사는 회사의 기능과 활동 또는 귀하와의 거래에 합리적으로
          </p>
          <p>필요한 개인정보만 수집합니다.</p>
          <p className="policy-part-title-2">개인정보의 수집 방법</p>
          <p style={{ lineHeight: '1.44', wordBreak: 'keep-all' }}>
            당사는 귀하가 요청을 제출하거나, 이메일을 보내거나, 주문을 하거나,
            설문조사를 완료하거나, 프로모션에 등록할 때, 귀하가 당사의 제품 또는
            서비스 중 하나와 관련된 앱을 다운로드하여 사용할 때, 또는 웹사이트
            분석과 같은 다른 출처 또는 기술 <br />
            정보를 포함한 당사 제품 및 서비스를 사용할 때 등 다양한 방법으로
            개인정보를 수집합니다.
          </p>
          <p
            style={{
              lineHeight: '1.44',
              wordBreak: 'keep-all',
              marginTop: 20,
            }}
          >
            예를들어, 귀하가 당ㅅ아에 주문을 하는 경우, 귀하는 당사가
          </p>
          <p
            style={{
              lineHeight: '1.44',
            }}
          >
            주문을 확인하고 주문을 처리하는 데 합리적으로 필요한 정보를
            <br /> 공하라는 요청을 받습니다. 이러한 정보가 없으면 주문을
          </p>
          <p
            style={{
              lineHeight: '1.44',
            }}
          >
            확인할 수 없고 (수락 한 경우) 주문을 처리 할 수 없습니다.
          </p>
        </div>
        <div className="policy-checkbox">
          <div>
            <IndCheckbox
              className="styled-checkbox"
              id="policy"
              type="checkbox"
              value="value2"
            />
            <label htmlFor="policy">{termTitle}</label>
          </div>
        </div>
      </ModalComponent> */}
    </div>
  );
}

export default Login;
