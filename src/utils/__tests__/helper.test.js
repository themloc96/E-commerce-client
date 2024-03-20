import { formatNumber, generateNameId } from '../helpers';

describe('formatNumber', () => {
  it('should return the string number , between ech digit', () => {
    const expected = '120,000';
    expect(formatNumber(120000)).toEqual(expected);
  });
});

describe('generateNameId', () => {
  it('returns string name and id', () => {
    const expected = 'Updated-Product-C-i.2';
    expect(generateNameId({ id: 2, name: 'Updated Product C' })).toEqual(
      expected,
    );
  });
});
