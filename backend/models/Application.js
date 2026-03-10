const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },

  jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  status: { type: String, enum: ['pending','hired','rejected','completed'], default: 'pending' },

}, { timestamps: true });

applicationSchema.index({ job: 1, jobseeker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);