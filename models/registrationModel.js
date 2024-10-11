const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class RegistrationModel {
  // Lấy tất cả các đăng ký môn học
  static async getAllRegistrations() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Course_Registration');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  }

  // Thêm một đăng ký môn học mới
  static async addRegistration(registration) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('registration_id', sql.NVarChar, registration.registration_id)
        .input('student_id', sql.NVarChar, registration.student_id)
        .input('course_id', sql.NVarChar, registration.course_id)
        .input('semester_id', sql.Int, registration.semester_id)
        .input('registration_date', sql.DateTime, registration.registration_date || new Date())
        .input('registration_status', sql.NVarChar, registration.registration_status)
        .query(`
          INSERT INTO Course_Registration (registration_id, student_id, course_id, semester_id, registration_date, registration_status)
          VALUES (@registration_id, @student_id, @course_id, @semester_id, @registration_date, @registration_status)
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error adding registration:', error);
      throw error;
    }
  }

  // Cập nhật thông tin đăng ký môn học
  static async updateRegistration(registration_id, registration) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('registration_id', sql.NVarChar, registration_id)
        .input('student_id', sql.NVarChar, registration.student_id)
        .input('course_id', sql.NVarChar, registration.course_id)
        .input('semester_id', sql.Int, registration.semester_id)
        .input('registration_date', sql.DateTime, registration.registration_date)
        .input('registration_status', sql.NVarChar, registration.registration_status)
        .query(`
          UPDATE Course_Registration
          SET student_id = @student_id, course_id = @course_id, semester_id = @semester_id,
              registration_date = @registration_date, registration_status = @registration_status
          WHERE registration_id = @registration_id
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error updating registration:', error);
      throw error;
    }
  }

  // Xóa một đăng ký môn học
  static async deleteRegistration(registration_id) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('registration_id', sql.NVarChar, registration_id)
        .query('DELETE FROM Course_Registration WHERE registration_id = @registration_id');
      return result.rowsAffected;
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }
}

module.exports = RegistrationModel;