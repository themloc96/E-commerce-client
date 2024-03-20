function getUser(id) {
  return {
    id,
    email: `${id}@test.com`,
  };
}

module.exports = getUser;
