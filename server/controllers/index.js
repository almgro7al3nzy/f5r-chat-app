const express = require('express');
const router = express.Router();

const userController = require('./user');
const messageController = require('./message');
const textController = require('./text')
const voiceController = require('./voice');
const whiteboardController = require('./whiteboard');


router.use('/user', userController);
router.use('/message', messageController);
router.use('/text', textController);
router.use('/voice', voiceController);
router.use('/whiteboard', whiteboardController);

module.exports = router;