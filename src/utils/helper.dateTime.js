import moment from 'moment';

export const formatShortDate = (value, format = 'YYYY-MM-DD') => {
  if(!value) return '';
  return moment(value).format(format);
}