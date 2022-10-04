const router = require('express').Router();
const mongoose = require('mongoose');

const passport = require('../middlewares/authentication');
const Message = require('../models/message');
const Text = require('../models/text');

//@Route - GET /api/message
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;
  const selectedChannel = req.query.channelName; 
  Message.find({ selectedChannel })
    .populate('sender')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec((error, result) => {
      if (error) res.status(500).send(error);
      result.sort((a, b) => a.createdAt - b.createdAt);
      res.json(result);
    });
});

//@Route - POST /api/message
router.post('/all', async (req, res) => {
  const limit = parseInt(req.body.limit) || 50;
  const channelNames = req.body.channelNames;
  const messageMap = {};
  const promises = [];
  channelNames.forEach( async ({ _id, name }) => {
    promises.push( new Promise((resolve, reject) => Message.find({ selectedChannel: _id })
      .populate('sender')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec((error, result) => {
        if (error){
          res.status(500).send(error);
          reject();
        } 
        result.sort((a, b) => a.createdAt - b.createdAt);
        messageMap[_id] = result;
        resolve();
    })));
  });
  await Promise.all(promises);
  res.json(messageMap);
});


//@Route - POST /api/message
router.post('/', passport.isLoggedIn(), (req, res) => {
  const { content, createdAt, selectedChannel } = req.body;

  const newMessage = new Message({
    selectedChannel,
    content, 
    createdAt,
    sender: new mongoose.Types.ObjectId(req.user._id), 
  });

  newMessage.save(null, (err, product) => {
    if (err) res.status(500).send(err);
    res.json(product);
  });
})


module.exports = router;