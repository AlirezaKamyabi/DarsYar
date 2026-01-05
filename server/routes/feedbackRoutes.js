const express = require('express');
const router = express.Router();
const { addFeedback, getFeedback } = require('../controllers/feedbackController');
const jwt = require('jsonwebtoken');

// Auth Middleware (Simplified)
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = { id: decoded.id, firstName: 'Student' }; // We need to fix User model to return name in token ideally, but this works for now
            next();
        } catch (error) { res.status(401).json({ message: 'Not authorized' }); }
    } else { res.status(401).json({ message: 'No token' }); }
};

router.post('/', protect, addFeedback);
router.get('/:courseId', getFeedback);

module.exports = router;
