const CourseRegistrationModel = require('../models/courseRegistrationModel');
const FeeModel = require('../models/feeModel');

class CourseRegistrationController {
  static validateCourseRegistration(registration) {
    const errors = [];
    if (!registration.student_id) errors.push('Student ID is required');
    if (!registration.course_id) errors.push('Course ID is required');
    if (!registration.semester_id) errors.push('Semester ID is required');
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(registration.registration_status)) 
      errors.push('Registration status must be Pending, Confirmed, or Cancelled');
    return errors;
  }

  static async getAllCourseRegistrations(req, res) {
    try {
      const courseRegistrations = await CourseRegistrationModel.getAllCourseRegistrations();
      res.status(200).json(courseRegistrations);
    } catch (error) {
      console.error('Error fetching course registrations:', error);
      res.status(500).json({ message: 'Error fetching course registrations', error: error.message });
    }
  }

  static async addCourseRegistration(req, res) {
    try {
      const registration = req.body;
      const errors = CourseRegistrationController.validateCourseRegistration(registration);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await CourseRegistrationModel.addCourseRegistration(registration);
      if (result > 0) {
        res.status(201).json({ message: 'Course registration added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add course registration' });
      }
    } catch (error) {
      console.error('Error adding course registration:', error);
      if (error.message === 'Course registration already exists') {
        res.status(400).json({ message: 'Course registration already exists' });
      } else {
        res.status(500).json({ message: 'Error adding course registration', error: error.message });
      }
    }
  }

  static async updateCourseRegistration(req, res) {
    try {
      const registrationId = req.params.id;
      const registration = req.body;
      const errors = CourseRegistrationController.validateCourseRegistration(registration);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await CourseRegistrationModel.updateCourseRegistration(registrationId, registration);
      
      if (typeof result === 'object' && result.tuitionFee) {
        res.status(200).json({ 
          message: 'Course registration confirmed and tuition fee calculated',
          feeDetails: result
        });
      } else if (result > 0) {
        res.status(200).json({ message: 'Course registration updated successfully' });
      } else {
        res.status(404).json({ message: 'Course registration not found' });
      }
    } catch (error) {
      console.error('Error updating course registration:', error);
      res.status(500).json({ message: 'Error updating course registration', error: error.message });
    }
  }

  static async deleteCourseRegistration(req, res) {
    try {
      const registrationId = req.params.id;
      const result = await CourseRegistrationModel.deleteCourseRegistration(registrationId);
      if (result > 0) {
        res.status(200).json({ message: 'Course registration deleted successfully' });
      } else {
        res.status(404).json({ message: 'Course registration not found' });
      }
    } catch (error) {
      console.error('Error deleting course registration:', error);
      res.status(500).json({ message: 'Error deleting course registration' });
    }
  }

  static async finalizeCourseRegistration(req, res) {
    try {
      const { studentId, semesterId } = req.body;
      if (!studentId) return res.status(400).json({ message: 'Student ID is required' });
      if (!semesterId) return res.status(400).json({ message: 'Semester ID is required' });

      const feeCalculation = await CourseRegistrationModel.finalizeCourseRegistrations(studentId, semesterId);

      res.status(200).json({
        message: 'Course registrations finalized and tuition fee calculated',
        feeDetails: feeCalculation
      });
    } catch (error) {
      console.error('Error finalizing course registration:', error);
      res.status(500).json({ message: 'Error finalizing course registration', error: error.message });
    }
  }

  static async getRegistrationSummary(req, res) {
    try {
      const { studentId, semesterId } = req.query;
      
      // Gọi phương thức trong model để lấy thông tin tổng kết
      const summary = await CourseRegistrationModel.getRegistrationSummary(studentId, semesterId);
      
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error getting registration summary:', error);
      res.status(500).json({ message: 'Error getting registration summary', error: error.message });
    }
  }
}

module.exports = CourseRegistrationController;
