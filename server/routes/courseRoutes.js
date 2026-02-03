const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getCourses, createCourse, joinCourse, getCourseDetails, addResource } = require('../controllers/courseController');

// ... (Keep the protect middleware code same as before) ...
const protect = (req, res, next) => { /* ... keep existing code ... */ 
    let token;
    if (req.headers.authorization) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = { id: decoded.id };
            next();
        } catch (error) { res.status(401).json({ message: 'Not authorized' }); }
    } else { res.status(401).json({ message: 'No token' }); }
};

router.get('/', protect, getCourses);
router.post('/', protect, createCourse);
router.post('/join', protect, joinCourse); // <--- NEW LINE
router.get('/:id', getCourseDetails);
router.post('/:id/resources', protect, addResource);

module.exports = router;