import { formatShortDate } from '../helper.dateTime';

describe('formatShortDate', () => {
  it('should return the short date time', () => {
    const expected = '2023-06-23';
    expect(formatShortDate('2023-06-23T11:20:13.672077')).toEqual(expected);
  });
});
