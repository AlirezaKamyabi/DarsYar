const Feedback = require('../models/Feedback');

exports.addFeedback = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;
        // Check if user already reviewed (Optional, for now let's allow multiple)
        const newFeedback = await Feedback.create({
            user: req.user.id,
            userName: req.user.firstName || 'Student', // Fallback if name missing
            courseId,
            rating,
            comment
        });
        res.status(201).json(newFeedback);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
