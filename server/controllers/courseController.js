const Course = require('../models/Course');
const Resource = require('../models/Resource');

// @desc    Get courses created BY me OR joined BY me
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            $or: [
                { user: req.user.id },      // Created by me
                { students: req.user.id }   // Joined by me
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { courseName, semester, instructor } = req.body;
        const newCourse = await Course.create({
            user: req.user.id,
            courseName,
            semester,
            instructor
        });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Join an existing course by ID
exports.joinCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Add user to students list if not already there
        if (!course.students.includes(req.user.id)) {
            course.students.push(req.user.id);
            await course.save();
        }

        res.json(course);
    } catch (error) {
        res.status(400).json({ message: 'Invalid Course ID' });
    }
};

// ... Keep getCourseDetails and addResource exactly as they were ...
exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const resources = await Resource.find({ courseId: req.params.id });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ course, resources });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.addResource = async (req, res) => {
    try {
        const { title, type, fileUrl } = req.body;
        const resource = await Resource.create({
            title, type, fileUrl, courseId: req.params.id, uploadedBy: req.user.id
        });
        res.status(201).json(resource);
    } catch (error) { res.status(400).json({ message: 'Invalid data' }); }
};