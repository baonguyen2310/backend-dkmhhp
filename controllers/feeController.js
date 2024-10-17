const FeeModel = require('../models/feeModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

class FeeController {
  static validateFee(fee) {
    const errors = [];
    if (!fee.student_id) errors.push('Student ID is required');
    if (!fee.semester_id) errors.push('Semester ID is required');
    if (typeof fee.total_credits !== 'number' || fee.total_credits <= 0) 
      errors.push('Total credits must be a positive number');
    if (typeof fee.tuition_fee !== 'number' || fee.tuition_fee < 0) 
      errors.push('Tuition fee must be a non-negative number');
    if (fee.discount && (typeof fee.discount !== 'number' || fee.discount < 0)) 
      errors.push('Discount must be a non-negative number');
    if (fee.amount_paid && (typeof fee.amount_paid !== 'number' || fee.amount_paid < 0)) 
      errors.push('Amount paid must be a non-negative number');
    if (!['Unpaid', 'Partially Paid', 'Paid'].includes(fee.payment_status)) 
      errors.push('Payment status must be Unpaid, Partially Paid, or Paid');
    return errors;
  }

  // Lấy tất cả các khoản học phí
  static async getAllFees(req, res) {
    try {
      const fees = await FeeModel.getAllFees();
      res.status(200).json(fees);
    } catch (error) {
      console.error('Error fetching fees:', error);
      res.status(500).json({ message: 'Error fetching fees', error: error.message });
    }
  }

  // Lấy thông tin học phí của một sinh viên
  static async getStudentFees(req, res) {
    try {
      const { studentId } = req.params;
      const fees = await FeeModel.getStudentFees(studentId);
      res.status(200).json(fees);
    } catch (error) {
      console.error('Error fetching student fees:', error);
      res.status(500).json({ message: 'Error fetching student fees', error: error.message });
    }
  }

  // Thêm một khoản học phí mới
  static async addFee(req, res) {
    try {
      const fee = req.body;
      const errors = FeeController.validateFee(fee);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await FeeModel.addFee(fee);
      if (result > 0) {
        res.status(201).json({ message: 'Fee added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add fee' });
      }
    } catch (error) {
      console.error('Error adding fee:', error);
      res.status(500).json({ message: 'Error adding fee', error: error.message });
    }
  }

  // Cập nhật thông tin học phí
  static async updateFee(req, res) {
    try {
      const feeId = req.params.id;
      const fee = req.body;
      const errors = FeeController.validateFee(fee);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await FeeModel.updateFee(feeId, fee);
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
      const feeId = req.params.id;
      const result = await FeeModel.deleteFee(feeId);
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

  static async makePayment(req, res) {
    try {
      const { feeId, amount, paymentDate } = req.body;
      if (!feeId) return res.status(400).json({ message: 'Fee ID is required' });
      if (typeof amount !== 'number' || amount <= 0) 
        return res.status(400).json({ message: 'Amount must be a positive number' });
      if (!paymentDate || isNaN(new Date(paymentDate).getTime())) 
        return res.status(400).json({ message: 'Valid payment date is required' });

      const result = await FeeModel.makePayment(feeId, amount, paymentDate);
      res.status(200).json({
        message: 'Payment processed successfully',
        paymentDetails: result
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
  }

  static async getUnpaidStudents(req, res) {
    try {
      const unpaidStudents = await FeeModel.getUnpaidStudents();
      res.status(200).json(unpaidStudents);
    } catch (error) {
      console.error('Error getting unpaid students:', error);
      res.status(500).json({ message: 'Error getting unpaid students', error: error.message });
    }
  }

  static async sendUnpaidStudentsReport(req, res) {
    try {
      const unpaidStudents = await FeeModel.getUnpaidStudents();

      // Tạo nội dung email
      const emailContent = `
        <h2>Danh sách sinh viên chưa hoàn thành việc đóng học phí</h2>
        <table border="1">
          <tr>
            <th>Mã sinh viên</th>
            <th>Họ và tên</th>
            <th>Học phí</th>
            <th>Đã đóng</th>
            <th>Còn nợ</th>
          </tr>
          ${unpaidStudents.map(student => `
            <tr>
              <td>${student.student_id}</td>
              <td>${student.last_name} ${student.first_name}</td>
              <td>${student.tuition_fee}</td>
              <td>${student.amount_paid}</td>
              <td>${student.remaining_balance}</td>
            </tr>
          `).join('')}
        </table>
      `;

      // Cấu hình nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Gửi email
      await transporter.sendMail({
        from: `"Hệ thống quản lý học phí" <${process.env.EMAIL_USER}>`,
        to: 'baonguyencoder97@gmail.com', // Thay bằng email thật của phòng tài vụ
        subject: `Danh sách sinh viên nợ học phí`,
        html: emailContent
      });

      res.status(200).json({ message: 'Unpaid students report sent successfully' });
    } catch (error) {
      console.error('Error sending unpaid students report:', error);
      res.status(500).json({ message: 'Error sending unpaid students report', error: error.message });
    }
  }
}

module.exports = FeeController;
