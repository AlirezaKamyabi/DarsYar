const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    user: { // <--- NEW: Links course to a specific student
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseName: { type: String, required: true },
    semester: { type: String, required: true }, // e.g., "Fall 2024"
    instructor: { type: String, required: true },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);