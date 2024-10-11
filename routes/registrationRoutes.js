const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/registrationController');

// Lấy tất cả các đăng ký môn học
router.get('/', RegistrationController.getAllRegistrations);

// Thêm một đăng ký môn học mới
router.post('/', RegistrationController.addRegistration);

// Cập nhật thông tin đăng ký môn học
router.put('/:id', RegistrationController.updateRegistration);

// Xóa một đăng ký môn học
router.delete('/:id', RegistrationController.deleteRegistration);

module.exports = router;