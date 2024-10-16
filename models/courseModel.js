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
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('course_id', sql.NVarChar, course.course_id)
        .input('course_name', sql.NVarChar, course.course_name)
        .input('credits_num', sql.Int, course.credits_num)
        .input('lesson_num', sql.Int, course.lesson_num)
        .input('course_type', sql.NVarChar, course.course_type)
        .input('department_id', sql.NVarChar, course.department_id)
        .query(`
          INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type, department_id)
          VALUES (@course_id, @course_name, @credits_num, @lesson_num, @course_type, @department_id)
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
        .input('department_id', sql.NVarChar, course.department_id)
        .query(`
          UPDATE Course
          SET course_name = @course_name, credits_num = @credits_num, lesson_num = @lesson_num, course_type = @course_type, department_id = @department_id
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
      throw error;
    }
  }
}

module.exports = CourseModel;
