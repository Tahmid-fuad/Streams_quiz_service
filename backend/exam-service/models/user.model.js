import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    otp: {
      value: {
        type: String,
        default: null,
      },
      expiresIn: {
        type: Date,
        default: null,
      },
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    submissionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
export { userSchema, User };
