const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Lấy tất cả các khoản thanh toán
router.get('/', PaymentController.getAllPayments);

// Lấy thông tin một khoản thanh toán cụ thể
router.get('/:id', PaymentController.getPaymentById);

// Thêm một khoản thanh toán mới
router.post('/', PaymentController.addPayment);

// Cập nhật thông tin thanh toán
router.put('/:id', PaymentController.updatePayment);

// Xóa một khoản thanh toán
router.delete('/:id', PaymentController.deletePayment);

module.exports = router;