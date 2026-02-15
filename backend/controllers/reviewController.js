const Review = require('../src/models/Review');
const Company = require('../src/models/Company');

// @desc    Get all reviews for a company
// @route   GET /api/reviews/company/:companyId
// @access  Public
exports.getReviewsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { sort } = req.query;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    let sortOption = { createdAt: -1 }; // Default: newest first

    if (sort === 'rating-high') {
      sortOption = { rating: -1 };
    } else if (sort === 'rating-low') {
      sortOption = { rating: 1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const reviews = await Review.find({ company: companyId })
      .sort(sortOption)
      .populate('company', 'name')
      .populate('user', 'name role');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('company', 'name')
      .populate('user', 'name role');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message,
    });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const { company, subject, reviewText, rating, profilePicture } = req.body;

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      company,
      fullName: req.user.name,
      subject,
      reviewText,
      rating,
      profilePicture: profilePicture || req.user.profilePicture || '',
    });

    const populatedReview = await Review.findById(review._id)
      .populate('company', 'name')
      .populate('user', 'name role');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating review',
      error: error.message,
    });
  }
};

// @desc    Update review likes
// @route   PUT /api/reviews/:id/like
// @access  Public
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review liked successfully',
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error liking review',
      error: error.message,
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Public
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const isOwner = review.user && review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own review',
      });
    }

    await Review.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message,
    });
  }
};
