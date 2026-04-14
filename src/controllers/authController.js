const authService = require('../services/authService');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, companyName } = req.body;

      // Validation
      if (!name || !email || !password || !companyName) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, email, password, companyName' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters' 
        });
      }

      const result = await authService.register({ name, email, password, companyName });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Register error:', error.message);
      
      if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Missing required fields: email, password' 
        });
      }

      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error.message);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;