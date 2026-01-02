const express = require('express');
const router = express.Router();
const { getCourses, getCourseDetails } = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/:id', getCourseDetails);
module.exports = router;
