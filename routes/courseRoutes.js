const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');

// Lấy tất cả các khóa học
router.get('/', CourseController.getAllCourses);

// Thêm một khóa học mới
router.post('/', CourseController.addCourse);

// Cập nhật thông tin khóa học
router.put('/:id', CourseController.updateCourse);

// Xóa một khóa học
router.delete('/:id', CourseController.deleteCourse);

module.exports = router;