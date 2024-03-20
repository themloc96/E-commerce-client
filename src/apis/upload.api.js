import { clientRequest } from '../utils/Request';

export const uploadRepesentActiveFileFn = async formData => {
  const response = await clientRequest.post(
    'v1/auth/upload/business',
    formData,
    {
      headers: {
        ContentType:
          'multipart/form-data; boundary=----WebKitFormBoundaryRrouvXOkU01wCDJt',
      },
    },
  );
  return response;
};
export const uploadBusinessClientFileFn = async formData => {
  const response = await clientRequest.post(
    'v1/file/upload/business-client',
    formData,
    {
      headers: {
        ContentType:
          'multipart/form-data; boundary=----WebKitFormBoundaryRrouvXOkU01wCDJt',
      },
    },
  );
  return response;
};
export const uploadASFileFn = async formData => {
  const response = await clientRequest.post(
    'v1/file/upload/as',
    formData,
    {
      headers: {
        ContentType:
          'multipart/form-data; boundary=----WebKitFormBoundaryRrouvXOkU01wCDJt',
      },
    },
  );
  return response;
};
