const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`);
});
