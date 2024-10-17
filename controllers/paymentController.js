const PaymentModel = require('../models/paymentModel');
const FeeModel = require('../models/feeModel');

class PaymentController {
  static validatePayment(payment) {
    const errors = [];
    if (!payment.fee_id) errors.push('Fee ID is required');
    if (!payment.payment_date) errors.push('Payment date is required');
    if (typeof payment.amount_paid !== 'number' || payment.amount_paid <= 0) 
      errors.push('Amount paid must be a positive number');
    return errors;
  }

  static async getAllPayments(req, res) {
    try {
      const payments = await PaymentModel.getAllPayments();
      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
  }

  static async getPaymentById(req, res) {
    try {
      const paymentId = req.params.id;
      const payment = await PaymentModel.getPaymentById(paymentId);
      if (payment) {
        res.status(200).json(payment);
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ message: 'Error fetching payment', error: error.message });
    }
  }

  static async addPayment(req, res) {
    try {
      const payment = req.body;
      const errors = PaymentController.validatePayment(payment);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const paymentId = await PaymentModel.addPayment(payment);
      
      // Cập nhật Tuition_Fees sau khi thêm thanh toán
      await FeeModel.updateAfterPayment(payment.fee_id, payment.amount_paid);

      res.status(201).json({ message: 'Payment added successfully', paymentId });
    } catch (error) {
      console.error('Error adding payment:', error);
      res.status(500).json({ message: 'Error adding payment', error: error.message });
    }
  }

  // Xóa các phương thức updatePayment và deletePayment
}

module.exports = PaymentController;
