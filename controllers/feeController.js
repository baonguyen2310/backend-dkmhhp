const FeeModel = require('../models/feeModel');
const nodemailer = require('nodemailer');

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
      res.status(500).json({ message: 'Error adding fee', error: error.message });
    }
  }

  // Cập nhật thông tin học phí
  static async updateFee(req, res) {
    try {
      const feeId = req.params.id;
      const fee = req.body;
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
      const { semesterId } = req.params;
      const unpaidStudents = await FeeModel.getUnpaidStudents(semesterId);
      res.status(200).json(unpaidStudents);
    } catch (error) {
      console.error('Error getting unpaid students:', error);
      res.status(500).json({ message: 'Error getting unpaid students', error: error.message });
    }
  }

  static async sendUnpaidStudentsReport(req, res) {
    try {
      const { semesterId } = req.params;
      const unpaidStudents = await FeeModel.getUnpaidStudents(semesterId);

      // Tạo nội dung email
      const emailContent = `
        <h2>Danh sách sinh viên chưa hoàn thành việc đóng học phí - Học kỳ ${semesterId}</h2>
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

      // Cấu hình nodemailer (bạn cần thay đổi thông tin này)
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password'
        }
      });

      // Gửi email
      await transporter.sendMail({
        from: '"Hệ thống quản lý học phí" <your-email@gmail.com>',
        to: 'phongdaotao@example.com',
        subject: `Danh sách sinh viên nợ học phí - Học kỳ ${semesterId}`,
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
