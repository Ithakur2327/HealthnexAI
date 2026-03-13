const express = require('express');
const router = express.Router();
const {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getLatestAssessment,
  deleteAssessment
} = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

// Authentication required for all routes
router.use(auth);

// CREATE - POST /api/assessment
router.post('/', createAssessment);

// READ ALL - GET /api/assessment/my-assessments
// MUST be before /:id
router.get('/my-assessments', getAllAssessments);

// READ LATEST - GET /api/assessment/latest
// MUST be before /:id
router.get('/latest', getLatestAssessment);

// READ ONE - GET /api/assessment/:id
// MUST be after specific routes
router.get('/:id', getAssessmentById);

// DELETE - DELETE /api/assessment/:id
router.delete('/:id', deleteAssessment);

module.exports = router;