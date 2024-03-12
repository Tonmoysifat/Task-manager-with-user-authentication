const mongoose = require("mongoose");
const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    otp: { type: String, require: true },
    status: { type: String, require: true },
  },
  { timestamps: true, versionKey: false }
);
const otpNumbers = mongoose.model("otpNumbers", OTPSchema);
module.exports = otpNumbers;
