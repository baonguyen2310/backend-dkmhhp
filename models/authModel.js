const sql = require('mssql');
const bcrypt = require('bcrypt');
const dbConfig = require('../config/dbConfig');

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

  // Create a new user
  static async createUser(user) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('userId', sql.NVarChar, user.userId) // Use the userId from the user object
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
      return result.recordset[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Assign role to user
  static async assignRoleToUser(userId, roleName) {
    try {
      const pool = await sql.connect(dbConfig);
      const roleResult = await pool.request()
        .input('roleName', sql.NVarChar, roleName)
        .query('SELECT role_id FROM Roles WHERE role_name = @roleName');
      
      if (roleResult.recordset.length === 0) {
        throw new Error('Role not found');
      }

      const roleId = roleResult.recordset[0].role_id;

      await pool.request()
        .input('userId', sql.NVarChar, userId)
        .input('roleId', sql.Int, roleId)
        .query('INSERT INTO UserRoles (user_id, role_id) VALUES (@userId, @roleId)');
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }
}

module.exports = AuthModel;