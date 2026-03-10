const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.code === "P2002")
    return res.status(409).json({ success: false, message: "Email already registered" });
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = { errorHandler };
