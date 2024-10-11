const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

// Lấy tất cả các sinh viên
router.get('/', StudentController.getAllStudents);

// Thêm một sinh viên mới
router.post('/', StudentController.addStudent);

// Cập nhật thông tin sinh viên
router.put('/:id', StudentController.updateStudent);

// Xóa một sinh viên
router.delete('/:id', StudentController.deleteStudent);

module.exports = router;