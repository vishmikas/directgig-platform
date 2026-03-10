const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: ['jobseeker','employer','admin'], required: true },
    isStudent:{ type: Boolean, default: false },

    profilePicture: { type: String, default: '' },
    phone:          { type: String, default: '' },

    university: { type: String, default: ''},
    skills:     [{ type: String }],

    companyName: { type: String, default: '' },

    nicUrl:       { type: String, default: '' },
    studentIdUrl: { type: String, default: '' },
    brUrl:        { type: String, default: '' },
    isVerified:   { type: Boolean, default: false },

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:  { type: Number, default: 0 },

    }, { timestamps: true }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);