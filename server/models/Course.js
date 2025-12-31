// server/models/Course.js
    const mongoose = require('mongoose');

    const CourseSchema = new mongoose.Schema({
        courseName: {
            type: String,
            required: true
        },
        semester: {
            type: String,
            required: true // e.g., "Fall 2024"
        },
        instructor: {
            type: String,
            required: true
        },
        // A course contains many resources (Association in Class Diagram)
        resources: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resource'
        }],
        // A course has assignments (Association in Class Diagram)
        assignments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    }, { timestamps: true });

    module.exports = mongoose.model('Course', CourseSchema);