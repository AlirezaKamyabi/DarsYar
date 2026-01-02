const Course = require('../models/Course');
const Resource = require('../models/Resource');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const resources = await Resource.find({ courseId: req.params.id });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ course, resources });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
