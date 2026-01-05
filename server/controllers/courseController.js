const Course = require('../models/Course');
const Resource = require('../models/Resource');

// @desc    Get ONLY the logged-in user's courses
// @route   GET /api/courses
exports.getCourses = async (req, res) => {
    try {
        // req.user.id comes from the middleware we will fix next
        const courses = await Course.find({ user: req.user.id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new course (Lesson)
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
    try {
        const { courseName, semester, instructor } = req.body;
        const newCourse = await Course.create({
            user: req.user.id, // Link to the student
            courseName,
            semester,
            instructor
        });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Get single course details
exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const resources = await Resource.find({ courseId: req.params.id });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ course, resources });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add resource
exports.addResource = async (req, res) => {
    try {
        const { title, type, fileUrl } = req.body;
        const resource = await Resource.create({
            title, type, fileUrl, courseId: req.params.id, uploadedBy: req.user.id
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};