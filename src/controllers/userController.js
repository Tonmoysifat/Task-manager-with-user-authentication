const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const SendEmailUtility = require("../utilities/SendEmailUtility");
const otpNumbers = require("../models/otpModel");

exports.createUser = async (req, res) => {
  try {
    let userData = req.body;
    await users.create(userData);
    let payLoad = {
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      data: userData["email"],
    };
    let token = jwt.sign(payLoad, "SecretKey123");
    res.json({
      status: "success",
      message: "Registration Completed",
      token: token,
    });
  } catch (error) {
    res.json({ status: "fail", message: error });
  }
};
exports.loginUser = async (req, res) => {
  try {
    let userData = req.body;
    let user = await users.find({
      email: userData["email"],
      password: userData["password"],
    });
    if (user.length > 0) {
      let payLoad = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: userData["email"],
      };
      let token = jwt.sign(payLoad, "SecretKey123");
      res.status(200).json({ status: "success", token: token });
    } else {
      res.status(404).json({ status: "fail", data: "No user found" });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error });
  }
};
exports.readUser = async (req, res) => {
  try {
    let email = req.headers["email"];
    let data = await users.aggregate([
      {
        $match: { email: email },
      },
      {
        $project: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
          password: 0,
        },
      },
    ]);
    res.json({ status: "success", UserInformation: data });
  } catch (error) {
    res.json({ status: "fail", data: error });
  }
};
exports.updateUser = async (req, res) => {
  try {
    let email = req.headers["email"];
    let updatedData = req.body;
    await users.updateOne({ email: email }, updatedData);
    res.json({ status: "success", message: "Successfully updated" });
  } catch (error) {
    res.json({ status: "fail", data: error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const email = req.body["email"];
    let user = await users.find({ email: email });
    if (user.length > 0) {
      await otpNumbers.deleteOne({ email: email });
      let OTP = Math.floor(100000 + Math.random() * 900000);

      await SendEmailUtility(
        email,
        `Your PIN: ${OTP}`,
        "MERN 5 Task Manager Code"
      );

      await otpNumbers.create({ email: email, otp: OTP, status: "active" });
      res.status(200).json({
        status: "success",
        email: email,
        message: "Verification code has been sent to your email",
      });
    } else {
      res.status(404).json({ status: "fail", data: "No user found" });
    }
  } catch (error) {
    res.json({ status: "fail", data: error.message });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const email = req.headers["email"];
    const otp = req.body["otp"];
    let user = await otpNumbers.find({
      email: email,
      otp: otp,
      status: "active",
    });
    if (user.length > 0) {
      await otpNumbers.updateOne(
        { email: email, otp: otp },
        { status: "verified" }
      );
      res.status(200).json({
        status: "success",
        message: "OTP Verification success",
        otp: otp,
      });
    } else {
      res.status(404).json({ status: "fail", data: "No user" });
    }
  } catch (error) {
    res.json({ status: "fail", data: error });
  }
};

exports.passwordReset = async (req, res) => {
  try {
    const email = req.headers["email"];
    const otp = req.headers["otp"];
    const newPass = req.body["New Password"];
    const confirmPass = req.body["Confirm Password"];
    if (newPass === confirmPass) {
      let user = await otpNumbers.find({
        email: email,
        otp: otp,
        status: "verified",
      });
      if (user.length > 0) {
        await otpNumbers.deleteOne({ email: email, otp: otp });
        await users.updateOne({ email: email }, { password: confirmPass });
        res.status(200).json({
          status: "success",
          message: "Password reset successfully done",
        });
      } else {
        res.status(404).json({ status: "fail", data: "No user" });
      }
    } else {
      res.status(404).json({
        status: "fail",
        data: "Please new password and confirm password should be equal",
      });
    }
  } catch (error) {
    res.json({ status: "fail", data: error });
  }
};
exports.deleteUser = async (req, res) => {
  try {
  } catch (error) {}
};
