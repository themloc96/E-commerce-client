import { loginStatus } from '../../constants';
import Layout from '../../layouts/layout';
import '../../styles/login/main.css';

function LoginBox(props) {
  const { status, title, children, loginBoxStyle, lineStyle } = props;
  return (
    <Layout>
      <div
        className={`login-box ${
          status === loginStatus.SIGN_UP_REPRESENTATIVE
            ? 'signup-representative'
            : ''
        } ${status === loginStatus.SIGN_UP ? 'sign-up' : ''}`}
        style={loginBoxStyle}
      >
        <div className="login-title">
          {!title || status === loginStatus.SIGN_IN ? (
            <>
              <p className="first-line-title">라오나크 공식</p>
              <p>도·소매 전문 플랫폼</p>
            </>
          ) : (
            <p>{title}</p>
            // <p>{title}</p>
          )}
        </div>
        <div className="line" style={lineStyle} />
        {children}
      </div>
    </Layout>
  );
}

export default LoginBox;
