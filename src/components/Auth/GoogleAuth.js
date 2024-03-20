import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { auth } from '../../constants/data/FirebaseLoginData';
import { saveSNSLoginToLS } from '../../utils/localStorageSNSLogin';
import { snsType } from '../../constants/jsonData/auth';

const handleGoogleLogin = loginUserWithFirebase => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(data => {
      const { displayName, email } = data.user;
      const userData = {
        displayName,
        email,
        snsType: snsType.GOOGLE,
      };
      saveSNSLoginToLS(userData);
      loginUserWithFirebase(userData);
    })
    .catch(err => {
      console.log(err);
    });
};

export default handleGoogleLogin;
