import { loginStatus } from "../../../constants";

function LoginBoxStyle(status, isVerifiedFindPassword) {
  // MOBILE
  if (window.innerWidth < 767) {
    switch (status) {
      case loginStatus.AUTH:
        return {
          marginTop: '92px',
        };
      case loginStatus.FIND_ID:
        return null;
      case loginStatus.FIND_PASSWORD:
        if (isVerifiedFindPassword) {
          return {
            marginTop: '64px',
          };
        }
        return null;
      case loginStatus.SIGN_IN:
        return null;
      case loginStatus.SIGN_UP:
        return {
          marginTop: '64px',
          marginBottom: '0px',
        };
      case loginStatus.SIGN_UP_EMPLOYEE:
        return null;
      case loginStatus.SIGN_UP_REPRESENTATIVE:
        return null;
      default:
        return {
          marginTop: '60px',
        };
    }
  }
  // PC
  switch (status) {
    case loginStatus.AUTH:
      return {
        margin: '99px auto 0px auto',
        // padding: '68px 58px 64px 58px',
        padding: '65px 58px 64px 58px',
      };
    case loginStatus.SIGN_IN:
      return {
        margin: '99px auto 0px auto',
        padding: '65px 58px 70px 60px',
      };
    case loginStatus.FIND_ID:
      return {
        margin: '99px auto 0px auto',
        padding: '62px 58px 73px 58px',
      };
    case loginStatus.FIND_PASSWORD:
      return {
        margin: '99px auto 0px auto',
        padding: '67px 58px 73px 58px',
      };
    case loginStatus.SIGN_UP:
      return {
        paddingBottom: '70px',
        marginBottom: '0px',
      };
    default:
      return null;
  }
}

export default LoginBoxStyle;
