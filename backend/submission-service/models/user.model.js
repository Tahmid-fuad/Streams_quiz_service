const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  submissionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student",
  },
});

module.exports = mongoose.model("User", userSchema);
