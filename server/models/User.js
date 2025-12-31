// server/models/User.js
    const mongoose = require('mongoose');

    const UserSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        studentId: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            enum: ['Student', 'Admin'], // From your Actor diagram
            default: 'Student'
        }
    }, { timestamps: true });

    module.exports = mongoose.model('User', UserSchema);