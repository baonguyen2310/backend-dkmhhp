const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class FeeModel {
  static async calculateTuitionFee(studentId, semesterId) {
    try {
      const pool = await sql.connect(dbConfig);
      
      // 1. Lấy thông tin về các khóa học đã đăng ký
      const registeredCourses = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .input('semester_id', sql.Int, semesterId)
        .query(`
          SELECT c.course_id, c.credits_num, c.course_type
          FROM Course_Registration cr
          JOIN Course c ON cr.course_id = c.course_id
          WHERE cr.student_id = @student_id AND cr.semester_id = @semester_id
        `);

      // 2. Lấy thông tin về mức phí cho từng loại khóa học
      const feeRates = await pool.request().query(`
        SELECT course_type, fee_per_credit
        FROM Fee_Rates
      `);
      const feeRateMap = new Map(feeRates.recordset.map(rate => [rate.course_type, rate.fee_per_credit]));

      // 3. Tính tổng học phí
      let totalTuitionFee = 0;
      let totalCredits = 0;

      for (const course of registeredCourses.recordset) {
        totalCredits += course.credits_num;
        const feePerCredit = feeRateMap.get(course.course_type) || 0;
        totalTuitionFee += course.credits_num * feePerCredit;
      }

      // 4. Kiểm tra giới hạn tín chỉ
      const creditRule = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .input('semester_id', sql.Int, semesterId)
        .query(`
          SELECT cr.min_credits, cr.max_credits
          FROM Credit_Rules cr
          JOIN Students s ON cr.class_id = s.class_id
          WHERE s.student_id = @student_id AND cr.semester_id = @semester_id
        `);

      if (creditRule.recordset.length > 0) {
        const { min_credits, max_credits } = creditRule.recordset[0];
        if (totalCredits < min_credits || totalCredits > max_credits) {
          throw new Error(`Total credits (${totalCredits}) is outside the allowed range (${min_credits}-${max_credits})`);
        }
      }

      // 5. Áp dụng giảm giá cho đối tượng ưu tiên
      const priorityDiscount = await this.getPriorityDiscount(studentId, totalTuitionFee);

      // 6. Lưu thông tin học phí vào bảng Tuition_Fees
      const result = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .input('semester_id', sql.Int, semesterId)
        .input('total_credits', sql.Int, totalCredits)
        .input('tuition_fee', sql.Decimal(18, 2), totalTuitionFee)
        .input('discount', sql.Decimal(18, 2), priorityDiscount)
        .input('payment_status', sql.NVarChar, 'Unpaid')
        .query(`
          INSERT INTO Tuition_Fees (student_id, semester_id, total_credits, tuition_fee, discount, amount_paid, payment_status)
          OUTPUT INSERTED.fee_id
          VALUES (@student_id, @semester_id, @total_credits, @tuition_fee, @discount, 0, @payment_status)
        `);

      const feeId = result.recordset[0].fee_id;

      return {
        feeId,
        totalCredits,
        tuitionFee: totalTuitionFee,
        priorityDiscount,
        paymentStatus: 'Unpaid'
      };
    } catch (error) {
      console.error('Error calculating tuition fee:', error);
      throw error;
    }
  }

  static async makePayment(feeId, amount, paymentDate) {
    try {
      const pool = await sql.connect(dbConfig);

      // Lấy thông tin về học phí và thời hạn thanh toán
      const feeInfo = await pool.request()
        .input('fee_id', sql.NVarChar, feeId)
        .query(`
          SELECT tf.fee_id, tf.student_id, tf.tuition_fee, tf.discount, tf.amount_paid, tf.payment_status, 
                 s.payment_deadline, s.early_payment_deadline
          FROM Tuition_Fees tf
          JOIN Semesters s ON tf.semester_id = s.semester_id
          WHERE tf.fee_id = @fee_id
        `);

      if (feeInfo.recordset.length === 0) {
        throw new Error('Fee record not found');
      }

      const { tuition_fee, discount, amount_paid, payment_status, payment_deadline, early_payment_deadline } = feeInfo.recordset[0];

      // Kiểm tra xem có phải là thanh toán đủ và sớm không
      const isFullPayment = amount >= (tuition_fee - discount - amount_paid);
      const isEarlyPayment = new Date(paymentDate) <= new Date(early_payment_deadline);

      let earlyPaymentDiscount = 0;
      if (isFullPayment && isEarlyPayment) {
        // Lấy tỷ lệ giảm giá cho thanh toán sớm từ bảng Fee_Discounts
        const discountInfo = await pool.request()
          .input('discount_type', sql.NVarChar, 'Early Payment')
          .query(`
            SELECT discount_percent
            FROM Fee_Discounts
            WHERE discount_type = @discount_type
          `);
        
        if (discountInfo.recordset.length > 0) {
          earlyPaymentDiscount = tuition_fee * (discountInfo.recordset[0].discount_percent / 100);
        }
      }

      // Cập nhật thông tin thanh toán
      const newAmountPaid = amount_paid + amount;
      const newPaymentStatus = newAmountPaid >= (tuition_fee - discount - earlyPaymentDiscount) ? 'Paid' : 'Partially Paid';

      // Cập nhật bảng Tuition_Fees
      await pool.request()
        .input('fee_id', sql.NVarChar, feeId)
        .input('amount_paid', sql.Decimal(18, 2), newAmountPaid)
        .input('payment_status', sql.NVarChar, newPaymentStatus)
        .query(`
          UPDATE Tuition_Fees
          SET amount_paid = @amount_paid, 
              payment_status = @payment_status
          WHERE fee_id = @fee_id
        `);

      // Thêm bản ghi vào bảng Fee_Payments
      await pool.request()
        .input('fee_id', sql.NVarChar, feeId)
        .input('payment_date', sql.DateTime, new Date(paymentDate))
        .input('amount_paid', sql.Decimal(10, 2), amount)
        .query(`
          INSERT INTO Fee_Payments (fee_id, payment_date, amount_paid)
          VALUES (@fee_id, @payment_date, @amount_paid)
        `);

      return {
        amountPaid: amount,
        newTotalPaid: newAmountPaid,
        earlyPaymentDiscount,
        newPaymentStatus,
        isEarlyPayment
      };
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }

  static async getAllFees() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT 
          tf.fee_id, 
          tf.student_id, 
          s.first_name, 
          s.last_name, 
          tf.semester_id, 
          sem.start_date,
          sem.end_date,
          sem.payment_deadline,
          sem.early_payment_deadline,
          tf.total_credits, 
          tf.tuition_fee, 
          tf.discount, 
          tf.amount_paid, 
          tf.payment_status
        FROM Tuition_Fees tf
        JOIN Students s ON tf.student_id = s.student_id
        JOIN Semesters sem ON tf.semester_id = sem.semester_id
        ORDER BY tf.semester_id DESC, s.last_name, s.first_name
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error fetching all fees:', error);
      throw error;
    }
  }

  static async getPriorityDiscount(studentId, tuitionFee) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('student_id', sql.NVarChar, studentId)
        .query(`
          SELECT s.priority, fd.discount_percent
          FROM Students s
          LEFT JOIN Fee_Discounts fd ON s.priority = fd.discount_type
          WHERE s.student_id = @student_id
        `);

      if (result.recordset.length > 0 && result.recordset[0].discount_percent) {
        return tuitionFee * (result.recordset[0].discount_percent / 100);
      }
      return 0;
    } catch (error) {
      console.error('Error getting priority discount:', error);
      throw error;
    }
  }

  // Các phương thức khác như addFee, updateFee, deleteFee có thể được thêm vào đây nếu cần
}

module.exports = FeeModel;
