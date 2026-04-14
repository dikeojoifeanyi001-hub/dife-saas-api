const jwt = require('jsonwebtoken');

const generateToken = (userId, companyId, role) => {
  const payload = {
    id: userId,
    companyId: companyId,
    role: role
  };
  
  const secret = process.env.JWT_SECRET || 'dife_super_secret_key_change_this_in_production';
  
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  
  return token;
};

module.exports = generateToken;