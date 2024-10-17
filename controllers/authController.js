const AuthModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY; // Use environment variable for the secret key
const bcrypt = require('bcrypt');

class AuthController {
  // Handle user login
  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await AuthModel.verifyUser(username, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Retrieve user roles
      const roles = await AuthModel.getUserRoles(user.user_id);

      // Generate JWT
      const token = jwt.sign({ id: user.user_id, role: roles }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle user logout (optional, depending on your token strategy)
  static logout(req, res) {
    // Implement logout logic if needed, such as invalidating tokens
    res.status(200).json({ message: 'Logged out successfully' });
  }

  // Handle user signup
  static async signup(req, res) {
    const { userId, username, password, email, firstName, lastName, role } = req.body;
    try {
      // Check if user already exists
      const existingUser = await AuthModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user with specified userId
      const newUser = await AuthModel.createUser({
        userId, // Pass the userId from the request
        username,
        passwordHash: hashedPassword,
        email,
        firstName,
        lastName
      });
      
      res.status(201).json({ message: 'User created successfully', userId: newUser.user_id });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;