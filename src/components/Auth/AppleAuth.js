import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../constants/data/FirebaseLoginData';

const handleAppleLogin = () => {
  const provider = new OAuthProvider('apple.com');
  signInWithPopup(auth, provider)
    .then(result => {
      console.log(result.user);
    })
    .catch(error => {
      console.log(error);
    });
};

export default handleAppleLogin;