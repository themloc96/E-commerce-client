import { getAccessMethodsByStrings } from '../productUtils';

describe('productUtils', () => {
  it('returns access method list', () => {
    const accessMethods = ['비밀번호'];
    const expected = [
      {
        text: '비밀번호',
        value: '비밀번호',
        icon: '/assets/icons/password-icon.png',
      },
    ];
    expect(
      getAccessMethodsByStrings(accessMethods),
    ).toEqual(expected);
  });
});
