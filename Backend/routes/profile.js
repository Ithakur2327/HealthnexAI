const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/', protect, deleteAccount);

module.exports = router;