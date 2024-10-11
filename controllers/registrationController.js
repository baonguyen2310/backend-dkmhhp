const RegistrationModel = require('../models/registrationModel');

class RegistrationController {
  // Lấy tất cả các đăng ký môn học
  static async getAllRegistrations(req, res) {
    try {
      const registrations = await RegistrationModel.getAllRegistrations();
      res.status(200).json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ message: 'Error fetching registrations' });
    }
  }

  // Thêm một đăng ký môn học mới
  static async addRegistration(req, res) {
    try {
      const registration = req.body;
      const result = await RegistrationModel.addRegistration(registration);
      if (result > 0) {
        res.status(201).json({ message: 'Registration added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add registration' });
      }
    } catch (error) {
      console.error('Error adding registration:', error);
      res.status(500).json({ message: 'Error adding registration' });
    }
  }

  // Cập nhật thông tin đăng ký môn học
  static async updateRegistration(req, res) {
    try {
      const registration_id = req.params.id;
      const registration = req.body;
      const result = await RegistrationModel.updateRegistration(registration_id, registration);
      if (result > 0) {
        res.status(200).json({ message: 'Registration updated successfully' });
      } else {
        res.status(404).json({ message: 'Registration not found' });
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      res.status(500).json({ message: 'Error updating registration' });
    }
  }

  // Xóa một đăng ký môn học
  static async deleteRegistration(req, res) {
    try {
      const registration_id = req.params.id;
      const result = await RegistrationModel.deleteRegistration(registration_id);
      if (result > 0) {
        res.status(200).json({ message: 'Registration deleted successfully' });
      } else {
        res.status(404).json({ message: 'Registration not found' });
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      res.status(500).json({ message: 'Error deleting registration' });
    }
  }
}

module.exports = RegistrationController;