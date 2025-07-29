const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `profile-${Date.now()}${ext}`);
    }
});

// File filter (image only)
const fileFilter = (req, file, cb) => {
    if (/image\/(jpeg|png|jpg)/.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png) are allowed'), false);
    }
};

module.exports = multer({ storage, fileFilter });
