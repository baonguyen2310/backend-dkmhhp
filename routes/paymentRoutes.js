const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Lấy tất cả các khoản thanh toán
router.get('/', PaymentController.getAllPayments);

// Lấy thông tin một khoản thanh toán cụ thể
router.get('/:id', PaymentController.getPaymentById);

// Thêm một khoản thanh toán mới
router.post('/', PaymentController.addPayment);

// Xóa các route để cập nhật và xóa thanh toán

module.exports = router;
