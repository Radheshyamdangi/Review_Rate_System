const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically update company's average rating when review is saved
reviewSchema.post('save', async function () {
  const Company = require('./Company');
  
  const stats = await this.constructor.aggregate([
    {
      $match: { company: this.company },
    },
    {
      $group: {
        _id: '$company',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Company.findByIdAndUpdate(this.company, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  }
});

// Update company's average rating when review is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Company = require('./Company');
    
    const stats = await this.model.aggregate([
      {
        $match: { company: doc.company },
      },
      {
        $group: {
          _id: '$company',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Company.findByIdAndUpdate(doc.company, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await Company.findByIdAndUpdate(doc.company, {
        averageRating: 0,
        totalReviews: 0,
      });
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
