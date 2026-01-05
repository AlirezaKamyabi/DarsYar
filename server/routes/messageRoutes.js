    const express = require('express');
    const router = express.Router();
    const { getMessages, sendMessage } = require('../controllers/messageController');
    const protect = require('../middleware/authMiddleware'); // Or reuse the protect function

    // (If you don't have separate middleware file, copy the protect function here)

    router.get('/:courseId', getMessages);
    router.post('/', sendMessage); // Add protect middleware here

    module.exports = router;
    
