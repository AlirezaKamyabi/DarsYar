const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getCourses, createCourse, getCourseDetails, addResource } = require('../controllers/courseController');

// Middleware to decode the Token (Security)
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123'); // Fallback secret
            req.user = { id: decoded.id };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token, authorization denied' });
    }
};

router.get('/', protect, getCourses);
router.post('/', protect, createCourse); // <--- New Route to add courses
router.get('/:id', getCourseDetails);
router.post('/:id/resources', protect, addResource);

module.exports = router;