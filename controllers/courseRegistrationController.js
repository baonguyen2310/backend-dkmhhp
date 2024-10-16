const CourseRegistrationModel = require('../models/courseRegistrationModel');
const FeeModel = require('../models/feeModel');

class CourseRegistrationController {
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
      const result = await CourseRegistrationModel.addCourseRegistration(registration);
      if (result > 0) {
        res.status(201).json({ message: 'Course registration added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add course registration' });
      }
    } catch (error) {
      console.error('Error adding course registration:', error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updateCourseRegistration(req, res) {
    try {
      const registrationId = req.params.id;
      const registration = req.body;
      const result = await CourseRegistrationModel.updateCourseRegistration(registrationId, registration);
      
      if (typeof result === 'object' && result.tuitionFee) {
        // Nếu kết quả là object chứa thông tin học phí
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

      // Kiểm tra xem việc đăng ký đã hoàn tất chưa (có thể thêm logic kiểm tra ở đây)

      // Tính toán học phí
      const feeCalculation = await FeeModel.calculateTuitionFee(studentId, semesterId);

      res.status(200).json({
        message: 'Course registration finalized and tuition fee calculated',
        feeDetails: feeCalculation
      });
    } catch (error) {
      console.error('Error finalizing course registration:', error);
      res.status(500).json({ message: 'Error finalizing course registration', error: error.message });
    }
  }
}

module.exports = CourseRegistrationController;
