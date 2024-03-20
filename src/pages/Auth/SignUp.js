import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { reducer } from '../../utils/Reducer';
import { loginType, signUpTypeSelected } from '../../constants';

function SignUp({ pageType = '' }) {
  const [state, setSate] = useReducer(reducer, {
    snsType: signUpTypeSelected.NONE,
  });

  const { snsType } = state;

  const handleSignUpType = value => {
    setSate({ snsType: value });
  };

  return (
    <div className="sign-up-container login-join-001">
      <p
        className="sign-up-label p-align-center mt-595 mt-custom"
        style={{ marginTop: 59.5, padding: 0 }}
      >
        회원 구분을 선택해주세요.
      </p>
      <div className="sign-up-classification">
        <button
          onClick={() => handleSignUpType(signUpTypeSelected.REPRESENTATIVE)}
          className={
            snsType === signUpTypeSelected.REPRESENTATIVE ? 'selected' : ''
          }
        >
          대표
        </button>
        <button
          onClick={() => handleSignUpType(signUpTypeSelected.EMPLOYEE)}
          className={snsType === signUpTypeSelected.EMPLOYEE ? 'selected' : ''}
        >
          직원
        </button>
      </div>
      <Link
        to={`${
          pageType === loginType.SOCIAL ? '/social-login' : ''
        }/sign-up/${snsType}`}
      >
        <button
          disabled={snsType === signUpTypeSelected.NONE}
          className={`sign-up-button ${
            snsType !== signUpTypeSelected.NONE ? ' sign-up-enable' : ''
          }`}
          style={
            (snsType === signUpTypeSelected.NONE ||
              snsType === signUpTypeSelected.REPRESENTATIVE ||
              snsType === signUpTypeSelected.EMPLOYEE) &&
            window.innerWidth > 600
              ? { marginTop: 60 }
              : { marginTop: 43 }
          }
        >
          다음
        </button>
      </Link>
    </div>
  );
}

export default SignUp;
