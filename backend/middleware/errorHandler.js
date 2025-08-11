const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.message && err.message.includes("format")) {
    return res.status(400).json({ error: "Unsupported image format" });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
