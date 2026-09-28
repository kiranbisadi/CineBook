const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Token must be present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Token must be valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check the user in the database
    //    (so a blocked or deleted user is stopped immediately,
    //    even if their token has not expired yet)
    const user = await User.findById(decoded.userId).select("role status");

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user no longer exists",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account is blocked",
      });
    }

    // 4. Save the user details for the next functions
    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

module.exports = protect;
