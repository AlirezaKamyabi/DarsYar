    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    exports.registerUser = async (req, res) => {
        try {
            const { firstName, lastName, email, password, studentId } = req.body;
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ message: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({ firstName, lastName, email, password: hashedPassword, studentId });
            res.status(201).json({ _id: user.id, firstName: user.firstName, token: generateToken(user._id) });
        } catch (error) { res.status(400).json({ message: 'Invalid user data' }); }
    };

    exports.loginUser = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ _id: user.id, firstName: user.firstName, role: user.role, token: generateToken(user._id) });
        } else { res.status(401).json({ message: 'Invalid email or password' }); }
    };

    const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
