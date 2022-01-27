const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    displayName: String,
    email: {
      type: String,
      required: true,
    },
    role: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
