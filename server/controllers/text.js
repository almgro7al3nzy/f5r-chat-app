const router = require('express').Router();

const passport = require('../middlewares/authentication');
const privilege = require('../middlewares/privilege');
const Text = require('../models/text');
const User = require('../models/user');
const Message = require('../models/message');

// @Route GET /api/text
router.get('/', passport.isLoggedIn(), (req, res) => {
  Text.find({}, (findErr, findRes) => {
    if (findErr) return res.status(500).send(findErr);
    res.json(findRes);
  })
});

// @Route GET /api/text
router.get('/:channelID', passport.isLoggedIn(), (req, res) => {
  Text.findOne({ _id: req.params.channelID }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json(result);
  });
});

// @Route POST /api/text
router.post('/', passport.isLoggedIn(), (req, res) => {
  Text.create({ name: req.body.name, messages: [] }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json(result);
  });
});

//@Route DELETE /api/text
router.delete('/delete/:channelID', passport.isLoggedIn(), (req, res) => {
  Text.deleteOne({ _id: req.params.channelID }, (error, result) => {
    if(error) return res.status(500).send(error);
    Message.deleteMany({ channel: req.params.channelID }, (error, result) => {
      if(error) return res.status(500).send(error);
      res.json({ _id: req.params.channelID });
    })
  });
});

module.exports = router;