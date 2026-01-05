const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const createUser = async () => {
    try {
        // 1. Delete old users to avoid duplicates
        await User.deleteMany();

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // 3. Create the user
        await User.create({
            firstName: 'Alireza',
            lastName: 'Kamyabi',
            email: 'ali@test.com',
            password: hashedPassword,
            studentId: '402407008'
        });

        console.log('✅ User Created! You can now login.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createUser();