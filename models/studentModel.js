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
      const isValidClass = await this.validateClassId(student.class_id);
      if (!isValidClass) {
        throw new Error('Invalid class_id');
      }

      const pool = await sql.connect(dbConfig);
      const existingStudent = await pool.request()
        .input('student_id', sql.NVarChar, student.student_id)
        .query('SELECT COUNT(*) as count FROM Students WHERE student_id = @student_id');

      if (existingStudent.recordset[0].count > 0) {
        throw new Error('Student ID already exists');
      }

      const result = await pool.request()
        .input('student_id', sql.NVarChar, student.student_id)
        .input('first_name', sql.NVarChar, student.first_name)
        .input('last_name', sql.NVarChar, student.last_name)
        .input('date_of_birth', sql.DateTime, new Date(student.date_of_birth))
        .input('gender', sql.NVarChar, student.gender)
        .input('hometown', sql.NVarChar, student.hometown)
        .input('discount_id', sql.Int, student.discount_id || null)
        .input('contact_address', sql.NVarChar, student.contact_address)
        .input('class_id', sql.NVarChar, student.class_id)
        .query(`
          INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, discount_id, contact_address, class_id)
          VALUES (@student_id, @first_name, @last_name, @date_of_birth, @gender, @hometown, @discount_id, @contact_address, @class_id)
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
      const isValidClass = await this.validateClassId(student.class_id);
      if (!isValidClass) {
        throw new Error('Invalid class_id');
      }

      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, student_id)
        .input('first_name', sql.NVarChar, student.first_name)
        .input('last_name', sql.NVarChar, student.last_name)
        .input('date_of_birth', sql.DateTime, student.date_of_birth)
        .input('gender', sql.NVarChar, student.gender)
        .input('hometown', sql.NVarChar, student.hometown)
        .input('discount_id', sql.Int, student.discount_id || null)
        .input('contact_address', sql.NVarChar, student.contact_address)
        .input('class_id', sql.NVarChar, student.class_id)
        .query(`
          UPDATE Students
          SET first_name = @first_name, last_name = @last_name, date_of_birth = @date_of_birth,
              gender = @gender, hometown = @hometown, discount_id = @discount_id, contact_address = @contact_address, class_id = @class_id
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

  static async validateClassId(class_id) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('class_id', sql.NVarChar, class_id)
        .query('SELECT COUNT(*) as count FROM Class WHERE class_id = @class_id');
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error validating class_id:', error);
      throw error;
    }
  }

  static async getClasses() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT class_id, class_name FROM Class');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  static async getFeeDiscounts() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT discount_id, discount_type, discount_percent FROM Fee_Discounts');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching fee discounts:', error);
      throw error;
    }
  }
}

module.exports = StudentModel;
