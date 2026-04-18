const jwt = require('jsonwebtoken');

const generateToken = (userId, companyId, role) => {
  return jwt.sign(
    { id: userId, companyId, role },
    process.env.JWT_SECRET
    // No expiresIn = token never expires
  );
};

module.exports = generateToken;