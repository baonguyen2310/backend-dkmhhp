const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/feeController');

// Lấy tất cả các khoản học phí
router.get('/', FeeController.getAllFees);

// Thêm một khoản học phí mới
router.post('/', FeeController.addFee);

// Cập nhật thông tin học phí
router.put('/:id', FeeController.updateFee);

// Xóa một khoản học phí
router.delete('/:id', FeeController.deleteFee);

module.exports = router;