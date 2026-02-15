const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');

router.route('/')
  .get(getCompanies)
  .post(protect, authorize('admin'), createCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(protect, authorize('admin'), updateCompany)
  .delete(protect, authorize('admin'), deleteCompany);

module.exports = router;
