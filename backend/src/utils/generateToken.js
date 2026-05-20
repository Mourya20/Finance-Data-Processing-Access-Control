const jwt = require('jsonwebtoken');

const getSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  console.warn('JWT_SECRET is not set. Using default development secret.');
  return 'dev-secret-key';
};

module.exports = (payload) => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: '1d'
  });
};