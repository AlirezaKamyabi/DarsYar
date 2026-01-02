const Course = require('../models/Course');
const Resource = require('../models/Resource'); // <--- This is the critical line!

// @desc    Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error(error); // Show error in terminal
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single course + resources
exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        // This is the line that was crashing if Resource wasn't imported
        const resources = await Resource.find({ courseId: req.params.id });
        
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json({ course, resources });
    } catch (error) {
        console.error(error); // Show error in terminal
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add resource
exports.addResource = async (req, res) => {
    try {
        const { title, type, fileUrl } = req.body;
        const resource = await Resource.create({
            title,
            type,
            fileUrl,
            courseId: req.params.id,
            uploadedBy: req.user.id // Requires auth middleware
        });
        res.status(201).json(resource);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
};