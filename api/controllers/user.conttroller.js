import crypto from "crypto";
import redis from "../cache/redis.cache.js";
import nodemailer from "nodemailer";
import Consumer from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { genToken } from "../utils/jwt.utils.js";

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || !email.includes("@")) {
      return res
        .status(400)
        .json({ code: 0, message: "Valid email is required." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    await redis.set(email, JSON.stringify({ otp, otpExpires }), "EX", 300);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log(`OTP sent: ${otp}`);
    res.status(200).json({ code: 1, message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ code: 0, message: "Error generating OTP." });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(process.env.JWT_SECRET);
  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ code: 0, message: "Email and OTP are required." });
    }

    const savedOtp = await redis.get(email);
    if (!savedOtp) {
      return res
        .status(400)
        .json({ message: "OTP expired or does not exist." });
    }

    const { otp: storedOtp, otpExpires } = JSON.parse(savedOtp);
    if (storedOtp != otp || Date.now() > otpExpires) {
      return res
        .status(400)
        .json({ code: 0, message: "Invalid or expired OTP." });
    }

    let user = await Consumer.findOne({ email });
    if (!user) {
      user = new Consumer({ email });
      await user.save();
    }

    const token = await genToken(user._id, res);
    console.log(token);
    res.status(200).json({
      code: 1,
      token,
      message: "Logged in successfully.",
      user,
    });

    await redis.del(email);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ code: 0, message: "Server error." });
  }
};

export const getUser = async (req, res) => {
  const id = req.user._id;

  try {
    const cacheKey = `user:${id}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      console.log("cached hit");
      return res.status(200).json({ code: 1, user: JSON.parse(cachedUser) });
    }
    const user = await Consumer.findById(id);
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);

    return res.status(200).json({ code: 1, user });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).json({ code: 0, message: "Error in getting user" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("a-token");
    return res
      .status(200)
      .json({ code: 1, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in logout" });
  }
};
export const saveLayout = async (req, res) => {
  const { layout } = req.body;
  try {
    console.log("Saving layout for user:", req.user._id);
    console.log("Layout data received:", layout);

    if (!Array.isArray(layout)) {
      return res.status(400).json({ 
        code: 0, 
        message: "Invalid layout format" 
      });
    }

    const user = await Consumer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        code: 0, 
        message: "User not found" 
      });
    }
    user.layout = layout;
    await user.save();

    console.log("Layout saved successfully for user:", user.email);
    
    res.status(200).json({ 
      code: 1, 
      message: "Layout saved successfully" 
    });
  } catch (error) {
    console.error("Error saving layout:", error);
    res.status(500).json({ 
      code: 0, 
      message: "Server error",
      error: error.message 
    });
  }
};

export const loadLayout = async (req, res) => {
  try {
    console.log("Loading layout for user ID:", req.user._id);
    
    const user = await Consumer.findById(req.user._id);
    if (!user) {
      console.log("User not found:", req.user._id);
      return res.status(404).json({ 
        code: 0, 
        message: "User not found" 
      });
    }

    console.log("Layout found:", user.layout);
    
    res.status(200).json({ 
      code: 1, 
      layout: user.layout 
    });
  } catch (error) {
    console.error("Error loading layout:", error);
    res.status(500).json({ 
      code: 0, 
      message: "Server error",
      error: error.message 
    });
  }
};