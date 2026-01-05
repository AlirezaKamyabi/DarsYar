const Task = require('../models/Task');

// @desc    Get tasks for a specific course
// @route   GET /api/tasks/:courseId
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ courseId: req.params.courseId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new task
// @route   POST /api/tasks
exports.addTask = async (req, res) => {
    try {
        const { title, deadline, courseId } = req.body;
        const newTask = await Task.create({
            title,
            deadline,
            courseId,
            status: 'Pending'
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: 'Invalid Data' });
    }
};

// @desc    Toggle Task Status (Pending <-> Completed)
// @route   PUT /api/tasks/:id
exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};