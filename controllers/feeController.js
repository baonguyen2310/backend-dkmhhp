const FeeModel = require('../models/feeModel');

class FeeController {
  // Lấy tất cả các khoản học phí
  static async getAllFees(req, res) {
    try {
      const fees = await FeeModel.getAllFees();
      res.status(200).json(fees);
    } catch (error) {
      console.error('Error fetching fees:', error);
      res.status(500).json({ message: 'Error fetching fees' });
    }
  }

  // Thêm một khoản học phí mới
  static async addFee(req, res) {
    try {
      const fee = req.body;
      const result = await FeeModel.addFee(fee);
      if (result > 0) {
        res.status(201).json({ message: 'Fee added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add fee' });
      }
    } catch (error) {
      console.error('Error adding fee:', error);
      res.status(500).json({ message: 'Error adding fee' });
    }
  }

  // Cập nhật thông tin học phí
  static async updateFee(req, res) {
    try {
      const fee_id = req.params.id;
      const fee = req.body;
      const result = await FeeModel.updateFee(fee_id, fee);
      if (result > 0) {
        res.status(200).json({ message: 'Fee updated successfully' });
      } else {
        res.status(404).json({ message: 'Fee not found' });
      }
    } catch (error) {
      console.error('Error updating fee:', error);
      res.status(500).json({ message: 'Error updating fee' });
    }
  }

  // Xóa một khoản học phí
  static async deleteFee(req, res) {
    try {
      const fee_id = req.params.id;
      const result = await FeeModel.deleteFee(fee_id);
      if (result > 0) {
        res.status(200).json({ message: 'Fee deleted successfully' });
      } else {
        res.status(404).json({ message: 'Fee not found' });
      }
    } catch (error) {
      console.error('Error deleting fee:', error);
      res.status(500).json({ message: 'Error deleting fee' });
    }
  }
}

module.exports = FeeController;