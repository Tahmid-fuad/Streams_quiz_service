// This middleware handles 404 errors for routes that are not found.
export default function notFoundMiddleware(req, res) {
  res.status(404).json({
    message: "404 | Route not found",
    path: req.url,
    origin: req.headers.origin || "Unknown",
    host: req.headers.host || "Unknown",
    method: req.method,
    timestamp: new Date().toISOString(),
    documentation:
      "Please refer to the API documentation for available routes.",
  });
}
