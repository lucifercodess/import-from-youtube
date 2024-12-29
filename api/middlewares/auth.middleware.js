import jwt from "jsonwebtoken";
import Consumer from "../models/user.model.js";

export const authMiddlware = async (req, res, next) => {
  try {
    const token = req.cookies["a-token"];
    console.log(token);

    if (!token) {
      return res.status(401).json({ code: 0, message: "not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ code: 0, message: "invalid token" });
    }

    const user = await Consumer.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ code: 0, message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in auth middleware" });
  }
};
