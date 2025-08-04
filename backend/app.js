const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

// Connect to DB
const database = require('./database/db');

// CORS (Allow frontend access)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Helmet config that allows image embedding
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        },
    })
);

// ✅ Allow static image access from frontend
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
database();



// Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const searchUser = require('./routes/searchUser');
const messageRoutes = require('./routes/messageRoutes');

app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/api/search', searchUser);
app.use('/api/messages', messageRoutes);

module.exports = app;
