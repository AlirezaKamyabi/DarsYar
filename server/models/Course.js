const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    user: { // The Creator (Professor/Admin Student)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{ // <--- NEW: List of students who joined
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    courseName: { type: String, required: true },
    semester: { type: String, required: true },
    instructor: { type: String, required: true },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);