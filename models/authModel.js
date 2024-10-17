const sql = require('mssql');
const bcrypt = require('bcrypt');
const dbConfig = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid'); // Add this at the top of your file

class AuthModel {
  // Verify user credentials
  static async verifyUser(username, password) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT * FROM Users WHERE username = @username');

      const user = result.recordset[0];
      if (user && await bcrypt.compare(password, user.password_hash)) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  // Retrieve user roles
  static async getUserRoles(userId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('user_id', sql.NVarChar, userId)
        .query(`
          SELECT r.role_name
          FROM UserRoles ur
          JOIN Roles r ON ur.role_id = r.role_id
          WHERE ur.user_id = @user_id
        `);

      return result.recordset.map(role => role.role_name);
    } catch (error) {
      console.error('Error retrieving user roles:', error);
      throw error;
    }
  }

  // Find user by username
  static async findUserByUsername(username) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT * FROM Users WHERE username = @username');
      return result.recordset[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  // Create a new user and assign a default role
  static async createUser(user) {
    try {
      const pool = await sql.connect(dbConfig);
      const userId = user.userId || uuidv4(); // Generate a UUID if userId is not provided
      const result = await pool.request()
        .input('userId', sql.NVarChar, userId)
        .input('username', sql.NVarChar, user.username)
        .input('passwordHash', sql.NVarChar, user.passwordHash)
        .input('email', sql.NVarChar, user.email)
        .input('firstName', sql.NVarChar, user.firstName)
        .input('lastName', sql.NVarChar, user.lastName)
        .query(`
          INSERT INTO Users (user_id, username, password_hash, email, first_name, last_name)
          OUTPUT INSERTED.user_id
          VALUES (@userId, @username, @passwordHash, @email, @firstName, @lastName)
        `);

      const createdUserId = result.recordset[0].user_id;

      // Assign default role with role_id = 2
      await pool.request()
        .input('userId', sql.NVarChar, createdUserId)
        .input('roleId', sql.Int, 2) // Default role_id
        .query('INSERT INTO UserRoles (user_id, role_id) VALUES (@userId, @roleId)');

      return createdUserId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}

module.exports = AuthModel;
