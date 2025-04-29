const express = require('express');
const {registerForEvent, unregisterFromEvent} = require('../controllers/registrationController');
const {verifyToken} = require('../middleware/authMiddleware');
const {register} = require("../controllers/authController");

const {getMyEvents} = require("../controllers/registrationController")

const router = express.Router();

router.post('/', verifyToken, registerForEvent);
router.get('/myevents', verifyToken, getMyEvents);
router.delete('/:eventId', verifyToken, unregisterFromEvent);

module.exports = router;

