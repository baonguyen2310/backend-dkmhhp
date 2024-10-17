const SemesterModel = require('../models/semesterModel');

class SemesterController {
  static async getAllSemesters(req, res) {
    try {
      const semesters = await SemesterModel.getAllSemesters();
      res.status(200).json(semesters);
    } catch (error) {
      console.error('Error fetching semesters:', error);
      res.status(500).json({ message: 'Error fetching semesters', error: error.message });
    }
  }
}

module.exports = SemesterController;
