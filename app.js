const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const feeRoutes = require('./routes/feeRoutes');
const courseRegistrationRoutes = require('./routes/courseRegistrationRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { authenticateToken, authorizeRoles } = require('./middlewares/authMiddleware');
const paymentRoutes = require('./routes/paymentRoutes');
const semesterRoutes = require('./routes/semesterRoutes');

const app = express();
// Sử dụng morgan middleware
app.use(morgan('dev'));

// Sử dụng cors middleware để cho phép tất cả các nguồn
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Use authentication middleware for all other routes
app.use(authenticateToken);

// Use routes with role-based authorization
app.use('/api/courses', authorizeRoles('admin', 'academic affairs staff'), courseRoutes);
app.use('/api/fees', authorizeRoles('admin', 'accounting staff'), feeRoutes);
app.use('/api/students', authorizeRoles('admin', 'academic affairs staff'), studentRoutes);
app.use('/api/course-registrations', authorizeRoles('admin', 'academic affairs staff'), courseRegistrationRoutes);
app.use('/api/payments', authorizeRoles('admin', 'accounting staff'), paymentRoutes);
app.use('/api/semesters', authorizeRoles('admin', 'academic affairs staff'), semesterRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 5004;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
