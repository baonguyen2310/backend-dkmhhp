const express = require('express');
const router = express.Router();
const CourseRegistrationController = require('../controllers/courseRegistrationController');

router.get('/', CourseRegistrationController.getAllCourseRegistrations);
router.post('/', CourseRegistrationController.addCourseRegistration);
router.put('/:id', CourseRegistrationController.updateCourseRegistration);
router.delete('/:id', CourseRegistrationController.deleteCourseRegistration);
router.post('/finalize', CourseRegistrationController.finalizeCourseRegistration);
router.get('/summary', CourseRegistrationController.getRegistrationSummary);

module.exports = router;
