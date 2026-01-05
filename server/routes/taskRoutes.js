const express = require('express');
const router = express.Router();
const { getTasks, addTask, updateTaskStatus } = require('../controllers/taskController');

router.get('/:courseId', getTasks);
router.post('/', addTask);
router.put('/:id', updateTaskStatus);

module.exports = router;