/* eslint-disable no-restricted-globals */
/* eslint-disable no-control-regex */
import axios from 'axios';
import debounce from 'lodash.debounce';
import { parseISO, isValid } from 'date-fns';

const WAIT_MS = 550;

export function formatNumber(number) {
  if (!number) return 0;
  return Math.round(number)
    .toString()
    .split(/(?=(?:\d{3})+(?:\.|$))/g)
    .join(',');
}

export async function requestCert(url) {
  const { IMP } = window;
  const userCode = 'imp10010430';
  IMP.init(userCode);

  return new Promise((resolve, reject) => {
    IMP.certification(
      {
        pg: 'inicis_unified.MIIkeyinap',
        merchant_uid: 'store-1ec1c3d1-66eb-404b-9593-1ae75d7faad4',
        m_redirect_url: url,
        popup: true,
      },
      async response => {
        try {
          const uid = response.imp_uid;
          const tokenRes = await axios.post(
            window.location.origin === 'http://localhost:3000'
              ? '/api/v1/portone/users/getToken'
              : 'https://api.keyin.app/api/v1/portone/users/getToken',
            {
              imp_key: '5208181617884070', // REST API 키
              imp_secret:
                'LQmx1xG5ZPbmKqw8cWQ05c6mUsY2Em78bCIzdjQu5teOZ2w0QJbjBE49sMq97Ua3xQVUzXURdw74OMRT', // REST API Secret
            },
          );
          const token = tokenRes.data.response.access_token;
          const userRes = await axios.get(
            window.location.origin === 'http://localhost:3000'
              ? `/api/v1/portone/certification/${uid}`
              : `https://api.keyin.app/api/v1/portone/certification/${uid}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          );
          const userName = userRes.data.response.name;
          const userPhone = userRes.data.response.phone;
          resolve({ name: userName, phone: userPhone });
        } catch (error) {
          console.log('Error occurred:', error);
          reject(error);
        }
      },
    );
  });
}

// export function requestCert() {
//   const { IMP } = window; // Can be omitted
//   const userCode = 'imp29272276';
//   IMP.init(userCode);
//   IMP.certification({
//     pg: 'inicis_unified',
//     merchant_uid: 'test_lj44lpus',
//   }, function (response) {
//     console.log(response);
//     axios.post('/iamport/users/getToken', {
//       imp_key: '5208181617884070', // REST API 키
//       imp_secret: 'LQmx1xG5ZPbmKqw8cWQ05c6mUsY2Em78bCIzdjQu5teOZ2w0QJbjBE49sMq97Ua3xQVUzXURdw74OMRT', // REST API Secret
//     })
//       .then(tokenRes => {
//         // 응답 처리
//         console.log('get token success');
//         console.log(tokenRes);
//       })
//       .catch(error => {
//         // 오류 처리
//         console.log('get token error');
//         console.log(error);
//       });
//   });
// }

export function removeSpecialCharacter(val) {
  return val.replace(/<[^>]*>|[^a-zA-Z0-9,;\-.!?<> ]/g, '');
}

export function generateNameId({ name, id }) {
  const niceURI =
    // eslint-disable-next-line prefer-template
    name
      .replace(/[\xa0\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, '')
      .replace(/\s/g, '-') + `-i.${id}`;
  return niceURI;
}

export function getIdFromNameId(nameId) {
  const array = nameId.split('-i.');
  return array[array.length - 1];
}

export function formateDate(val) {
  // const date = parseISO(val);
  const date = new Date(val);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(date.getDate()).padStart(2, '0')}`;
}

export function formateDate2(val) {
  const date = parseISO(val);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

export const withDebounce = func => debounce(func, WAIT_MS);

export function isEmptyObject(obj) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key) && obj[key]) {
      return false;
    }
  }
  return true;
}

export function formatCost(val) {
  return new Intl.NumberFormat().format(val);
}

export function calculatePercentageOfPrice(percent, price) {
  return Math.floor((percent * price) / 100);
}
export const generateUId = () => {
  const head = Date.now().toString(36);
  const tail = Math.random().toString(36).substr(2);
  return head + tail;
};

export const productOptionsText = (text, value) => {
  return `${text}. ${Math.round(value * 1.1) || ''}`;
};

export const setOnErrorImage = id => {
  const element = document.querySelector(`#${id}`);
  if (element) {
    element.src = '/assets/products/no-image.png';
  }
};

export const copyLink = link => {
  const el = document.createElement('textarea');
  el.value = `${window.location.origin}${link}`;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export function calculatePercentageRounding(percent, price) {
  const percentage = ((percent * price) / 100).toString();
  const number = parseFloat(percentage.replace(/,/g, ''));
  const formattedNumber = Math.trunc(number).toLocaleString();
  return formattedNumber;
}

export const callComingSoon = () => {
  alert('페이지 준비중입니다.');
};

export function isValidExtensionFile(file) {
  const fileName = file.name;
  const exts = ['.jpg', '.jpeg', '.png', '.pdf'];
  // eslint-disable-next-line prefer-template
  return new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$').test(
    fileName.toLowerCase(),
  );
}
export function isValidExtensionFileV2(file, exts = ['.jpg', '.jpeg', '.png']) {
  const fileName = file.name;
  // eslint-disable-next-line prefer-template
  return new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$').test(
    fileName?.toLowerCase(),
  );
}

export function isNumeric(str) {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export function getCategoryType(type) {
  switch (type) {
    case 'COMPANY_NEWS':
      return '회사 소식';
    case 'NEW_PRODUCT':
      return '신제품 출시';
    case 'EVENTS':
      return '행사 안내';
    case 'REPORT':
      return '보도자료';
    case 'QUALITY_TECHNOLOGY':
      return '품질/기술';
    case 'OPERATE':
      return '운영관련';
    default:
      return '카테고리';
  }
}

export function getMobileType() {
  const userAgent = navigator.userAgent.toLowerCase();
  let newMobileType = '';
  if (userAgent.includes('raonark_android')) {
    newMobileType = 'android';
  } else if (
    userAgent.includes('raonark_iphone') ||
    userAgent.includes('raonark_ipad') ||
    userAgent.includes('raonark_ipod')
  ) {
    newMobileType = 'iphone';
  } else {
    newMobileType = 'default';
  }
  return newMobileType;
}

// export async function downloadFile(url) {
//   try {
//     const image = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//       },
//     });

//     if (!image.ok) {
//       throw new Error('Network response was not ok');
//     }

//     if (getMobileType() === 'android') {
//       window.raonark.downloadImg(url);
//     } else if (getMobileType() === 'iphone') {
//       window.webkit.messageHandlers.downloadImg.postMessage(url);
//       // window.webkit.messageHandlers.fcmTokenSend.postMessage(data.username);
//     } else {
//       const link = document.createElement('a');

//       const imageURL = URL.createObjectURL(await image.blob());
//       const httpUrl = imageURL.replace('http://', 'https://');
//       link.href = httpUrl;

//       // Split image name
//       const nameSplit = url.split('/');
//       link.href = url; // Use the original URL directly
//       const duplicateName = nameSplit.pop();
//       link.download = duplicateName;

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   } catch (error) {
//     console.error('Error occurred during image download:', error);
//   }
// }

export async function downloadFile(url) {
  try {
    const image = await fetch(url, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    if (!image.ok) {
      throw new Error('Network response was not ok');
    }

    if (getMobileType() === 'android') {
      window.raonark.downloadImg(url);
    } else if (getMobileType() === 'iphone') {
      window.webkit.messageHandlers.downloadImg.postMessage(url);
    } else {
      const blob = await image.blob();
      const imageURL = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = imageURL;

      const nameSplit = url.split('/');
      const duplicateName = nameSplit.pop();
      link.download = duplicateName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error occurred during file download:', error);
  }
}


export async function downloadMultipleFiles(urls) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const url of urls) {
      // eslint-disable-next-line no-await-in-loop
      await downloadFile(url);
    }
  } catch (error) {
    console.error('Error occurred during file download:', error);
  }
}

export function convertSelectListData({ data, textField, valueField }) {
  if (!data || data?.length === 0) return [];
  return data?.map(item => ({
    label: item[textField],
    value: item[valueField],
  }));
}

export function getFileName(file) {
  return file.split('/').pop();
}
