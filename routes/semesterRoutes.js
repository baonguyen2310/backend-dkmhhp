const express = require('express');
const router = express.Router();
const SemesterController = require('../controllers/semesterController');

router.get('/', SemesterController.getAllSemesters);

module.exports = router;
