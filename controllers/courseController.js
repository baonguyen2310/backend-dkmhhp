const CourseModel = require('../models/courseModel');

class CourseController {
  static validateCourse(course) {
    const errors = [];
    if (!course.course_id) errors.push('Course ID is required');
    if (!course.course_name) errors.push('Course name is required');
    if (typeof course.credits_num !== 'number' || course.credits_num <= 0) 
      errors.push('Credits number must be a positive number');
    if (typeof course.lesson_num !== 'number' || course.lesson_num <= 0) 
      errors.push('Lesson number must be a positive number');
    if (!['Theory', 'Practice'].includes(course.course_type)) 
      errors.push('Course type must be Theory, Practice, or Project');
    return errors;
  }

  // Lấy tất cả các khóa học
  static async getAllCourses(req, res) {
    try {
      const courses = await CourseModel.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Error fetching courses' });
    }
  }

  // Thêm một khóa học mới
  static async addCourse(req, res) {
    try {
      const course = req.body;
      const errors = CourseController.validateCourse(course);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      
      const result = await CourseModel.addCourse(course);
      if (result > 0) {
        res.status(201).json({ message: 'Course added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add course' });
      }
    } catch (error) {
      console.error('Error adding course:', error);
      if (error.message === 'Course ID already exists') {
        res.status(400).json({ message: 'Course ID already exists' });
      } else {
        res.status(500).json({ message: 'Error adding course', error: error.message });
      }
    }
  }

  // Cập nhật thông tin khóa học
  static async updateCourse(req, res) {
    try {
      const course_id = req.params.id;
      const course = req.body;
      const errors = CourseController.validateCourse(course);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await CourseModel.updateCourse(course_id, course);
      if (result > 0) {
        res.status(200).json({ message: 'Course updated successfully' });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Error updating course' });
    }
  }

  // Xóa một khóa học
  static async deleteCourse(req, res) {
    try {
      const course_id = req.params.id;
      const result = await CourseModel.deleteCourse(course_id);
      if (result > 0) {
        res.status(200).json({ message: 'Course deleted successfully' });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.message.includes('Cannot delete course')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error deleting course' });
      }
    }
  }
}

module.exports = CourseController;
