const getUser = require('./user');

test('retutn a user object', () => {
  // 객체를 검증할 일이 있을때는 toBe 대신 toEqual 함수를 사용해야 한다.
  expect(getUser(1)).toEqual({
    id: 1,
    email: `1@test.com`,
  });
});
