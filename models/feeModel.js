const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class FeeModel {
  // Lấy tất cả các khoản học phí
  static async getAllFees() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Tuition_Fees');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching fees:', error);
      throw error;
    }
  }

  // Thêm một khoản học phí mới
  static async addFee(fee) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('fee_id', sql.NVarChar, fee.fee_id)
        .input('student_id', sql.NVarChar, fee.student_id)
        .input('semester_id', sql.Int, fee.semester_id)
        .input('total_credits', sql.Int, fee.total_credits)
        .input('tuition_fee', sql.Decimal(18, 2), fee.tuition_fee)
        .input('discount', sql.Decimal(18, 2), fee.discount)
        .input('amount_paid', sql.Decimal(18, 2), fee.amount_paid)
        .input('payment_status', sql.NVarChar, fee.payment_status)
        .query(`
          INSERT INTO Tuition_Fees (fee_id, student_id, semester_id, total_credits, tuition_fee, discount, amount_paid, payment_status)
          VALUES (@fee_id, @student_id, @semester_id, @total_credits, @tuition_fee, @discount, @amount_paid, @payment_status)
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error adding fee:', error);
      throw error;
    }
  }

  // Cập nhật thông tin học phí
  static async updateFee(fee_id, fee) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('fee_id', sql.NVarChar, fee_id)
        .input('student_id', sql.NVarChar, fee.student_id)
        .input('semester_id', sql.Int, fee.semester_id)
        .input('total_credits', sql.Int, fee.total_credits)
        .input('tuition_fee', sql.Decimal(18, 2), fee.tuition_fee)
        .input('discount', sql.Decimal(18, 2), fee.discount)
        .input('amount_paid', sql.Decimal(18, 2), fee.amount_paid)
        .input('payment_status', sql.NVarChar, fee.payment_status)
        .query(`
          UPDATE Tuition_Fees
          SET student_id = @student_id, semester_id = @semester_id, total_credits = @total_credits,
              tuition_fee = @tuition_fee, discount = @discount, amount_paid = @amount_paid, payment_status = @payment_status
          WHERE fee_id = @fee_id
        `);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error updating fee:', error);
      throw error;
    }
  }

  // Xóa một khoản học phí
  static async deleteFee(fee_id) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('fee_id', sql.NVarChar, fee_id)
        .query('DELETE FROM Tuition_Fees WHERE fee_id = @fee_id');
      return result.rowsAffected;
    } catch (error) {
      console.error('Error deleting fee:', error);
      throw error;
    }
  }
}

module.exports = FeeModel;