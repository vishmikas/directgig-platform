const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({

  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  jobType:     { type: String, enum: ['promoter','data-entry','event','other'], required: true },

  location:  { type: String, required: true },
  date:      { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },

  wage: { type: Number, required: true, min: 0 },

  slots:       { type: Number, required: true, min: 1 },
  filledSlots: { type: Number, default: 0 },

  status:   { type: String, enum: ['open','filled','completed','cancelled'], default: 'open' },
  isActive: { type: Boolean, default: true },

}, { timestamps: true });

jobSchema.pre('save', function(next) {
  if (this.filledSlots >= this.slots) this.status = 'filled';
  next();
});

module.exports = mongoose.model('Job', jobSchema);