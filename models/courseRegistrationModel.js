const sql = require('mssql');
const dbConfig = require('../config/dbConfig');
const FeeModel = require('./feeModel');

class CourseRegistrationModel {
  // ... các phương thức hiện có ...

  static async addCourseRegistration(registration) {
    try {
      const pool = await sql.connect(dbConfig);

      // Kiểm tra môn tiên quyết
      const prerequisiteCheck = await this.checkPrerequisites(registration.student_id, registration.course_id);
      if (!prerequisiteCheck.success) {
        throw new Error(prerequisiteCheck.message);
      }

      // Kiểm tra giới hạn tín chỉ
      const creditLimitCheck = await this.checkCreditLimit(registration.student_id, registration.semester_id);
      if (!creditLimitCheck.success) {
        throw new Error(creditLimitCheck.message);
      }

      // Thêm đăng ký môn học
      const result = await pool.request()
        .input('student_id', sql.NVarChar, registration.student_id)
        .input('course_id', sql.NVarChar, registration.course_id)
        .input('semester_id', sql.Int, registration.semester_id)
        .input('registration_status', sql.NVarChar, 'Registered')
        .query(`
          INSERT INTO Course_Registration (student_id, course_id, semester_id, registration_status)
          VALUES (@student_id, @course_id, @semester_id, @registration_status)
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async checkPrerequisites(studentId, courseId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .input('course_id', sql.NVarChar, courseId)
        .query(`
          SELECT pc.prerequisite_course_id
          FROM Prerequisite_Course pc
          LEFT JOIN CourseResults cr ON cr.course_id = pc.prerequisite_course_id AND cr.student_id = @student_id
          WHERE pc.course_id = @course_id AND (cr.grade IS NULL OR cr.grade < 'D')
        `);
      
      if (result.recordset.length > 0) {
        return { success: false, message: 'Prerequisite courses not completed' };
      }
      return { success: true };
    } catch (error) {
      console.error('Error checking prerequisites:', error);
      throw error;
    }
  }

  static async checkCreditLimit(studentId, semesterId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .input('semester_id', sql.Int, semesterId)
        .query(`
          SELECT SUM(c.credits_num) as total_credits, cr.max_credits
          FROM Course_Registration cr
          JOIN Course c ON cr.course_id = c.course_id
          JOIN Credit_Rules cr ON cr.class_id = (SELECT class_id FROM Students WHERE student_id = @student_id)
          WHERE cr.student_id = @student_id AND cr.semester_id = @semester_id AND cr.semester_id = @semester_id
          GROUP BY cr.max_credits
        `);
      
      if (result.recordset.length > 0) {
        const { total_credits, max_credits } = result.recordset[0];
        if (total_credits > max_credits) {
          return { success: false, message: 'Credit limit exceeded' };
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error checking credit limit:', error);
      throw error;
    }
  }

  static async updateCourseRegistration(registrationId, registration) {
    try {
      const pool = await sql.connect(dbConfig);
      
      // Kiểm tra thời gian chỉnh sửa
      const editCheck = await this.checkEditPeriod(registrationId);
      if (!editCheck.success) {
        throw new Error(editCheck.message);
      }

      // Cập nhật đăng ký
      const result = await pool.request()
        .input('registration_id', sql.Int, registrationId)
        .input('course_id', sql.NVarChar, registration.course_id)
        .input('registration_status', sql.NVarChar, registration.registration_status)
        .query(`
          UPDATE Course_Registration
          SET course_id = @course_id, registration_status = @registration_status
          WHERE registration_id = @registration_id
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error updating course registration:', error);
      throw error;
    }
  }

  static async checkEditPeriod(registrationId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('registration_id', sql.Int, registrationId)
        .query(`
          SELECT cr.registration_date, s.registration_deadline
          FROM Course_Registration cr
          JOIN Semesters s ON cr.semester_id = s.semester_id
          WHERE cr.registration_id = @registration_id
        `);
      
      if (result.recordset.length > 0) {
        const { registration_date, registration_deadline } = result.recordset[0];
        const now = new Date();
        if (now > registration_deadline) {
          return { success: false, message: 'Edit period has ended' };
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error checking edit period:', error);
      throw error;
    }
  }

  static async getStudentInfoByRegistrationId(registrationId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('registration_id', sql.NVarChar, registrationId)
        .query(`
          SELECT student_id, semester_id
          FROM Course_Registration
          WHERE registration_id = @registration_id
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Error getting student info:', error);
      throw error;
    }
  }

  static async checkAllRegistrationsConfirmed(studentId, semesterId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .input('semester_id', sql.Int, semesterId)
        .query(`
          SELECT COUNT(*) as total, SUM(CASE WHEN registration_status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed
          FROM Course_Registration
          WHERE student_id = @student_id AND semester_id = @semester_id
        `);
      const { total, confirmed } = result.recordset[0];
      return total === confirmed && total > 0;
    } catch (error) {
      console.error('Error checking registrations:', error);
      throw error;
    }
  }

  static async getAllCourseRegistrations() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Course_Registration');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching course registrations:', error);
      throw error;
    }
  }
}

module.exports = CourseRegistrationModel;
