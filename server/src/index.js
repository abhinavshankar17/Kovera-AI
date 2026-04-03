const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('Kovera AI Resilience API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/policy', require('./routes/policyRoutes'));
app.use('/api/simulation', require('./routes/simulationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
