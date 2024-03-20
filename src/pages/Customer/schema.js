import * as yup from 'yup';

const schema = () => {
  return yup.object().shape({
    clientNumber: yup.string().required('clientNumber error'),
    clientName: yup.string().required(() => '고객명을 확인해 주세요'),
    clientPhone: yup.string().required(() => '휴대전화번호를 확인해 주세요'), // Required
    clientSecondPhone: yup.string(),
    clientPostNumber: yup.string().required(() => '주소를 확인해 주세요'), // Required
    clientAddress: yup.string().required(() => '주소를 확인해 주세요'), // Required
    clientDetailAddress: yup.string(),
    clientNote: yup.string(),
    productSerial: yup.string().required(() => '시리얼 번호를 확인해 주세요.'),
    installationDate: yup.string().required(() => '설치일을 입력해 주세요'),
    installationImage: yup.string().required('설치 사진을 업로드해 주세요'),
    modelName: yup.string().required('모델을 선택해 주세요'),
  });
};

export default schema;
