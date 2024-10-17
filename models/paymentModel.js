const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class PaymentModel {
  static async getAllPayments() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT fp.*, tf.student_id, s.first_name, s.last_name, sem.semester_name
        FROM Fee_Payments fp
        JOIN Tuition_Fees tf ON fp.fee_id = tf.fee_id
        JOIN Students s ON tf.student_id = s.student_id
        JOIN Semesters sem ON tf.semester_id = sem.semester_id
        ORDER BY fp.payment_date DESC
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw error;
    }
  }

  static async getPaymentById(paymentId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('payment_id', sql.Int, paymentId)
        .query(`
          SELECT fp.*, tf.student_id, s.first_name, s.last_name, sem.semester_name
          FROM Fee_Payments fp
          JOIN Tuition_Fees tf ON fp.fee_id = tf.fee_id
          JOIN Students s ON tf.student_id = s.student_id
          JOIN Semesters sem ON tf.semester_id = sem.semester_id
          WHERE fp.payments_id = @payment_id
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Error fetching payment by ID:', error);
      throw error;
    }
  }

  static async addPayment(payment) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('fee_id', sql.NVarChar, payment.fee_id)
        .input('payment_date', sql.DateTime, new Date(payment.payment_date))
        .input('amount_paid', sql.Decimal(10, 2), payment.amount_paid)
        .query(`
          INSERT INTO Fee_Payments (fee_id, payment_date, amount_paid)
          OUTPUT INSERTED.payments_id
          VALUES (@fee_id, @payment_date, @amount_paid)
        `);
      return result.recordset[0].payments_id;
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }
}

module.exports = PaymentModel;
