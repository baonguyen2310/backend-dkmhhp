const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class CourseModel {
  // Lấy tất cả các môn học
  static async getAllCourses() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Course');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Thêm một môn học mới
  static async addCourse(course) {
    try {
      const exists = await this.checkCourseExists(course.course_id);
      if (exists) {
        throw new Error('Course ID already exists');
      }
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('course_id', sql.NVarChar, course.course_id)
        .input('course_name', sql.NVarChar, course.course_name)
        .input('credits_num', sql.Int, course.credits_num)
        .input('lesson_num', sql.Int, course.lesson_num)
        .input('course_type', sql.NVarChar, course.course_type)
        .query(`
          INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type)
          VALUES (@course_id, @course_name, @credits_num, @lesson_num, @course_type)
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Cập nhật thông tin môn học
  static async updateCourse(course_id, course) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('course_id', sql.NVarChar, course_id)
        .input('course_name', sql.NVarChar, course.course_name)
        .input('credits_num', sql.Int, course.credits_num)
        .input('lesson_num', sql.Int, course.lesson_num)
        .input('course_type', sql.NVarChar, course.course_type)
        .query(`
          UPDATE Course
          SET course_name = @course_name, credits_num = @credits_num, lesson_num = @lesson_num, course_type = @course_type
          WHERE course_id = @course_id
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // Xóa một môn học
  static async deleteCourse(course_id) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('course_id', sql.NVarChar, course_id)
        .query('DELETE FROM Course WHERE course_id = @course_id');
      return result.rowsAffected;
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.number === 547) { // SQL Server error number for foreign key constraint violation
        throw new Error('Cannot delete course due to existing related data');
      }
      throw error;
    }
  }

  static async checkCourseExists(course_id) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('course_id', sql.NVarChar, course_id)
        .query('SELECT COUNT(*) as count FROM Course WHERE course_id = @course_id');
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error checking course existence:', error);
      throw error;
    }
  }
}

module.exports = CourseModel;
