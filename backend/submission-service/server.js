const express = require('express');
const app = express();
const port = process.env.PORT || 3002; // Using 3002 to avoid conflict with other services

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'submission-service' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Submission Service is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Submission service listening on port ${port}`);
});
