export const snsType = {
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
  APPLE: 'APPLE',
  GOOGLE: 'GOOGLE',
  HOMEPAGE: 'HOMEPAGE',
};
export const tokenLifeTime = {
  ONE_WEEK: new Date().getTime() + 3600 * 168000,
  // DEFAULT: new Date().getTime() + 3600 * 500, // 30 mumites
  DEFAULT: new Date().getTime() + 6 * 3600 * 1000, // 6 hour
};
