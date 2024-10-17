const StudentModel = require('../models/studentModel');

class StudentController {
  // Lấy tất cả các sinh viên
  static async getAllStudents(req, res) {
    try {
      const students = await StudentModel.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Error fetching students' });
    }
  }

  // Hàm validation tùy chỉnh
  static validateStudent(student) {
    const errors = [];

    if (!student.student_id) {
      errors.push('Student ID is required');
    }
    if (!student.first_name) {
      errors.push('First name is required');
    }
    if (!student.last_name) {
      errors.push('Last name is required');
    }
    if (!student.date_of_birth) {
      errors.push('Date of birth is required');
    } else {
      const dob = new Date(student.date_of_birth);
      if (isNaN(dob.getTime())) {
        errors.push('Invalid date of birth');
      }
    }
    if (!student.gender || !['Male', 'Female'].includes(student.gender)) {
      errors.push('Gender must be Male or Female');
    }
    // Thêm các validation khác nếu cần

    return errors;
  }

  // Thêm một sinh viên mới
  static async addStudent(req, res) {
    try {
      const student = req.body;
      const validationErrors = StudentController.validateStudent(student);

      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      const result = await StudentModel.addStudent(student);
      if (result > 0) {
        res.status(201).json({ message: 'Student added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add student' });
      }
    } catch (error) {
      console.error('Error adding student:', error);
      if (error.message === 'Student ID already exists') {
        res.status(400).json({ message: 'Student ID already exists' });
      } else if (error.message === 'Invalid class_id') {
        res.status(400).json({ message: 'Invalid class ID' });
      } else {
        res.status(500).json({ message: 'Error adding student', error: error.message });
      }
    }
  }

  // Cập nhật thông tin sinh viên
  static async updateStudent(req, res) {
    try {
      const student_id = req.params.id;
      const student = req.body;
      const validationErrors = StudentController.validateStudent(student);

      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      const result = await StudentModel.updateStudent(student_id, student);
      if (result > 0) {
        res.status(200).json({ message: 'Student updated successfully' });
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.message === 'Invalid class_id') {
        res.status(400).json({ message: 'Invalid class ID' });
      } else {
        res.status(500).json({ message: 'Error updating student' });
      }
    }
  }

  // Xóa một sinh viên
  static async deleteStudent(req, res) {
    try {
      const student_id = req.params.id;
      const result = await StudentModel.deleteStudent(student_id);
      if (result > 0) {
        res.status(200).json({ message: 'Student deleted successfully' });
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      // Kiểm tra nếu là lỗi liên quan đến dữ liệu
      if (error.message.includes('Cannot delete student')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error deleting student' });
      }
    }
  }

  static async getClasses(req, res) {
    try {
      const classes = await StudentModel.getClasses();
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'Error fetching classes' });
    }
  }
}

module.exports = StudentController;
