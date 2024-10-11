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

  // Thêm một sinh viên mới
  static async addStudent(req, res) {
    try {
      const student = req.body;
      if (!student.student_id) {
        return res.status(400).json({ message: 'Student ID is required' });
      }
      
      // Chuyển đổi date_of_birth thành đối tượng Date
      if (student.date_of_birth) {
        student.date_of_birth = new Date(student.date_of_birth);
        if (isNaN(student.date_of_birth.getTime())) {
          return res.status(400).json({ message: 'Invalid date of birth' });
        }
      }

      const result = await StudentModel.addStudent(student);
      if (result > 0) {
        res.status(201).json({ message: 'Student added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add student' });
      }
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ message: 'Error adding student', error: error.message });
    }
  }

  // Cập nhật thông tin sinh viên
  static async updateStudent(req, res) {
    try {
      const student_id = req.params.id;
      const student = req.body;
      const result = await StudentModel.updateStudent(student_id, student);
      if (result > 0) {
        res.status(200).json({ message: 'Student updated successfully' });
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Error updating student' });
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
}

module.exports = StudentController;