const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await Course.create([
            { courseName: 'Systems Analysis', semester: 'Fall 2024', instructor: 'Dr. Saeed' },
            { courseName: 'Data Structures', semester: 'Fall 2024', instructor: 'Dr. Alavi' }
        ]);
        console.log('Data Imported!');
        process.exit();
    } catch (error) { console.error(error); process.exit(1); }
};
importData();
