const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

// Database connection
const database = require('./database/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const searchUser = require('./routes/searchUser');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Connect to MongoDB
database();

app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/api/search',searchUser);


module.exports = app;
