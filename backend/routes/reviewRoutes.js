const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReviewsByCompany,
  getReviewById,
  createReview,
  likeReview,
  deleteReview,
} = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/company/:companyId', getReviewsByCompany);
router.get('/:id', getReviewById);
router.put('/:id/like', protect, likeReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
