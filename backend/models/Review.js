const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },

  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '', maxlength: 500 },

}, { timestamps: true });

reviewSchema.index({ job: 1, reviewer: 1 }, { unique: true });

reviewSchema.post('save', async function() {
  const stats = await this.constructor.aggregate([
    { $match: { reviewee: this.reviewee } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  await mongoose.model('User').findByIdAndUpdate(this.reviewee, {
    averageRating: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
    totalReviews:  stats[0] ? stats[0].count : 0,
  });
});

module.exports = mongoose.model('Review', reviewSchema);