import * as yup from 'yup';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from '../../../constants/form/validations';

const schema = ({ isSignUpWithSocial }) => {
  if (isSignUpWithSocial) {
    return yup.object().shape({
      // username: yup.string().required(() => '아이디를 입력해주세요.'),
      email: yup
        .string()
        .required(() => '이메일 정보를 확인해 주세요.')
        .email('이메일 정보를 확인해 주세요.')
        .matches(EMAIL_REGEX, '이메일 정보를 확인해 주세요.'),
      businessRegistrationNumber: yup
        .string()
        .required(() => '사용자 정보를 확인해주세요.'),
      name: yup.string().required(() => '본인인증을 진행해 주세요.'),
      terms: yup.string().required(() => '필수 약관에 동의해주세요.'),
    });
  }
  return yup.object().shape({
    id: yup.string().required(() => '아이디를 입력해주세요.'),
    password: yup
      .string()
      .required(
        () =>
          '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
      )
      .matches(
        PASSWORD_REGEX,
        '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
      ),
    passwordConfirmation: yup
      .string()
      .required(
        () =>
          '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
      )
      .matches(
        PASSWORD_REGEX,
        '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
      )
      .oneOf([yup.ref('password'), null], '비밀번호를 확인해주세요.'),
    email: yup
      .string()
      .required(() => '이메일 정보를 확인해 주세요.')
      .email('이메일 정보를 확인해 주세요.')
      .matches(EMAIL_REGEX, '이메일 정보를 확인해 주세요.'),
    // phone: yup
    //   .string()
    //   .required(() => '휴대폰 번호를 확인해주세요.')
    //   .min(11, '휴대폰 번호를 확인해주세요.')
    //   .max(11, '휴대폰 번호를 확인해주세요.'),
    name: yup.string().required(() => '본인인증을 진행해 주세요.'),
    businessRegistrationNumber: yup
      .number()
      .typeError('사업자 등록번호를 확인해주세요.') // businessRegistrationNumber must be a number
      .required('사업자 등록번호를 확인해주세요.')
      .min(0, '사업자 등록번호를 확인해주세요.'),
    terms: yup.string().required(() => '필수 약관에 동의해주세요.'),
  });
};
export default schema;
