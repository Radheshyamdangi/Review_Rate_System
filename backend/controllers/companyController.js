const Company = require('../src/models/Company');

// @desc    Get all companies with search and filter
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const { search, location, city } = req.query;
    
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message,
    });
  }
};

// @desc    Get single company by ID
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message,
    });
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Public
exports.createCompany = async (req, res) => {
  try {
    const { name, location, city, foundedOn, logo, description } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name, city });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this name already exists in this city',
      });
    }

    const company = await Company.create({
      name,
      location,
      city,
      foundedOn,
      logo,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating company',
      error: error.message,
    });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Public
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating company',
      error: error.message,
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Public
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting company',
      error: error.message,
    });
  }
};