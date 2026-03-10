const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Access token required" });

  try {
    const blacklisted = await redisClient.get(`blacklist:${token}`);
    if (blacklisted) return res.status(401).json({ success: false, message: "Token has been revoked" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const checkRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
  next();
};

module.exports = { verifyToken, checkRole };
