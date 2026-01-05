    const Message = require('../models/Message');

    // Get messages for a course (We use courseId, although Day 2 model might need update, let's just use a filter)
    // Note: Day 2 Message.js was simple. Let's assume we link it to a course.
    // If Message.js doesn't have courseId, we need to add it or just use it loosely.
    // Let's UPDATE Message.js first.

    /* UPDATE server/models/Message.js */
    /*
    const mongoose = require('mongoose');
    const MessageSchema = new mongoose.Schema({
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        sender: { type: String, required: true }, // Store name directly for simplicity
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    });
    module.exports = mongoose.model('Message', MessageSchema);
    */

    exports.getMessages = async (req, res) => {
        try {
            const messages = await Message.find({ courseId: req.params.courseId }).sort({ createdAt: 1 });
            res.json(messages);
        } catch (error) { res.status(500).json({ message: 'Error' }); }
    };

    exports.sendMessage = async (req, res) => {
        try {
            const { text, courseId } = req.body;
            const newMessage = await Message.create({
                courseId,
                sender: req.user.firstName || 'Student',
                text
            });
            res.status(201).json(newMessage);
        } catch (error) { res.status(500).json({ message: 'Error' }); }
    };
    
