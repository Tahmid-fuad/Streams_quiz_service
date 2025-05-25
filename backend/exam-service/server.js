const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Using 3001 to avoid conflict with auth-service

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'exam-service' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Exam Service is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Exam service listening on port ${port}`);
});
