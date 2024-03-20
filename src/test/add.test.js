const add = require('./add');

test('10 + 30 은 40이 맞습니까?', () => {
  expect(add(10, 30)).toBe(40);
});

// 추가 함수에 대해서는 아래 url 참고
// https://jestjs.io/docs/api
