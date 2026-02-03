const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

// 1. Define the Auth Middleware locally to avoid import errors
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token' });
    }
};

// 2. GET Messages
router.get('/:courseId', async (req, res) => {
    try {
        const messages = await Message.find({ courseId: req.params.courseId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error("Get Msg Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 3. SEND Message
router.post('/', protect, async (req, res) => {
    try {
        const { text, courseId, senderName } = req.body;

        const newMessage = await Message.create({
            courseId,
            sender: senderName || 'Anonymous', // Fallback if name is missing
            text
        });
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Send Msg Error:", error); // This will show the real error in terminal
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;