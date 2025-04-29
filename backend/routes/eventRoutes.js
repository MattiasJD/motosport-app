const express = require('express');
const { getEvents, createEvent } = require('../controllers/eventController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.post('/', verifyToken, verifyAdmin, createEvent);

module.exports = router;
