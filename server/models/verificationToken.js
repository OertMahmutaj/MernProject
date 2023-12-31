const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const verificationTokenSchema = new mongoose.Schema({
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required : true,
  },
  token : {
    type: String,
    required : true,
  },
  createdAt : {
    type: Date,
    expires: 3600,
    default: Date.now(),
  }
});

verificationTokenSchema.pre('save', async function(next) {
    if (!this.isModified('token')) {
      next();
    }
    const hash = await bcrypt.hash(this.token, 10);
    this.token = hash;
    next();
  });

verificationTokenSchema.methods.compareToken = async function(token) {
  return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
