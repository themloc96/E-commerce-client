
import { loginStatus } from "../../../constants";

function LineStyle(status, isVerifiedFindPassword) {
 switch (status) {
   case loginStatus.AUTH:
     return { marginTop: 33, marginBottom: 40.1 };
   case loginStatus.FIND_ID:
     return { marginBottom: 50.1 };
   case loginStatus.FIND_PASSWORD:
     if (isVerifiedFindPassword) {
       return { marginTop: 35 };
     }
     return { marginBottom: 50.1 };
   case loginStatus.SIGN_UP:
     return { marginTop: 33 };
   case loginStatus.SIGN_UP_REPRESENTATIVE:
     // return { marginTop: 36, marginBottom: 51.5 };
     return { marginTop: 36, marginBottom: 48 };
   default:
     return null;
 }
}

export default LineStyle;
