const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/feeController');

// Lấy tất cả các khoản học phí
router.get('/', FeeController.getAllFees);

// Lấy thông tin học phí của một sinh viên
router.get('/student/:studentId', FeeController.getStudentFees);

// Lấy danh sách sinh viên chưa đóng học phí
router.get('/unpaid-students/:semesterId', FeeController.getUnpaidStudents);

// Gửi báo cáo sinh viên chưa đóng học phí
router.post('/send-unpaid-report/:semesterId', FeeController.sendUnpaidStudentsReport);

module.exports = router;
