export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value: ${field} already exists.`,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};
