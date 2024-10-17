const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class SemesterModel {
  static async getAllSemesters() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT semester_id, semester_name, start_date, end_date
        FROM Semesters
        ORDER BY start_date DESC
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error getting all semesters:', error);
      throw error;
    }
  }
}

module.exports = SemesterModel;
