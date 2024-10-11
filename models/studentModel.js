const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class StudentModel {
  // Lấy tất cả các sinh viên
  static async getAllStudents() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Students');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Thêm một sinh viên mới
  static async addStudent(student) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, student.student_id)
        .input('first_name', sql.NVarChar, student.first_name)
        .input('last_name', sql.NVarChar, student.last_name)
        .input('date_of_birth', sql.DateTime, new Date(student.date_of_birth))
        .input('gender', sql.NVarChar, student.gender)
        .input('hometown', sql.NVarChar, student.hometown)
        .input('priority', sql.NVarChar, student.priority)
        .input('contact_address', sql.NVarChar, student.contact_address)
        .query(`
          INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address)
          VALUES (@student_id, @first_name, @last_name, @date_of_birth, @gender, @hometown, @priority, @contact_address)
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Cập nhật thông tin sinh viên
  static async updateStudent(student_id, student) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, student_id)
        .input('first_name', sql.NVarChar, student.first_name)
        .input('last_name', sql.NVarChar, student.last_name)
        .input('date_of_birth', sql.DateTime, student.date_of_birth)
        .input('gender', sql.NVarChar, student.gender)
        .input('hometown', sql.NVarChar, student.hometown)
        .input('priority', sql.NVarChar, student.priority)
        .input('contact_address', sql.NVarChar, student.contact_address)
        .input('class_id', sql.NVarChar, student.class_id)
        .query(`
          UPDATE Students
          SET first_name = @first_name, last_name = @last_name, date_of_birth = @date_of_birth,
              gender = @gender, hometown = @hometown, priority = @priority, contact_address = @contact_address, class_id = @class_id
          WHERE student_id = @student_id
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  // Xóa một sinh viên
  static async deleteStudent(student_id) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, student_id)
        .query('DELETE FROM Students WHERE student_id = @student_id');
      return result.rowsAffected;
    } catch (error) {
      console.error('Error deleting student:', error);
      // Ném lỗi với thông báo cụ thể
      throw new Error('Cannot delete student due to existing related data');
    }
  }
}

module.exports = StudentModel;