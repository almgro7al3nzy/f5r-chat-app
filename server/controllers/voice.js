const router = require('express').Router();

const passport = require('../middlewares/authentication');
const privilege = require('../middlewares/privilege');
const User = require('../models/user');
const Voice = require('../models/voice');

// @Route GET /api/voice
router.get('/', passport.isLoggedIn(), (req, res) => {
  Voice.find({}, (findErr, findRes) => {
    if (findErr) res.status(500).send(findErr.errmsg);
    res.json(findRes);
  })
});

// @Route POST /api/voice
router.post('/', passport.isLoggedIn(), (req, res) => {
  Voice.create({ name: req.body.name }, (error) => {
    if (error) return res.status(500).send(error.errmsg);
    res.json({ success: true })
  });
});

//@Route DELETE /api/voice
router.delete('/delete/:channelID', passport.isLoggedIn(), (req, res) => {
  Voice.deleteOne({ _id: req.params.channelID }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json({result});
  });
});

// @Route PUT /api/voice/join-voice
router.put('/join-voice', passport.isLoggedIn(), (req, res) => {
  const socketId = req.body.socketId;
  const currentVoiceChannel = req.body.channelName;

  Voice.findOne({ name: currentVoiceChannel }, (error, result) => {
    if (req.user.currentVoiceChannel === currentVoiceChannel)
      return res.status(200).send("You're already in this voice channel!");
    result.set(`talkers.${socketId}`, JSON.stringify({ ...req.user._doc, currentVoiceChannel })); //this needs to be in string format 
    result.save( (error, result) => {
      if (error) return res.status(500).send(error.errmsg);

      User.findOne({ email: req.user.email }, (error, result) => {
        if(error) return res.status(500).send(error.errmsg);
        Voice.findOne({ name: result.currentVoiceChannel }, (error, result) => {
          if (error) return res.status(500).send(error.errmsg);
          if (!result) return;

          result.talkers.delete(socketId);
          result.save();
        });
        User.updateOne({ email: req.user.email }, { currentVoiceChannel }, (error, result) => {
        })
      })
      res.json(result);
    })
  })
})

// @Route PUT /api/voice/leave-voice
router.put('/leave-voice', passport.isLoggedIn(), (req, res) => {
  Voice.findOne({ name: req.body.name }, (error, result) => {
    if (error) return res.status(500).send(error.errmsg);
    result.talkers.delete(req.body.socketId);
    result.save((error, result) => {
      if (error) return res.status(500).send(error.errmsg);
      User.findOne({email: req.user.email}, (error, result) => {
        if (error) return res.status(500).send(error.errmsg);
        User.updateOne({ email: req.user.email }, { currentVoiceChannel: '' }, (error, result) => {
          if (error) return res.status(500).send(error.errmsg);
          res.json(result);
        })
      })
    });
  })
});

// @Route PUT /api/voice/kick
router.put('/kick', passport.isLoggedIn(), privilege.canKick(), (req, res) => {
  Voice.findOne({ name: req.body.name }, (error, result) => {
    if (error) return res.status(500).send(error.errmsg);
    result.talkers.delete(req.body.socketId);
    result.save((error, result) => {
      if (error) return res.status(500).send(error.errmsg);
      User.findOne({ email: req.body.email }, (error, result) => {
        if (error) return res.status(500).send(error.errmsg);
        User.updateOne({ email: req.body.email }, { currentVoiceChannel: '' }, (error, result) => {
          if (error) return res.status(500).send(error.errmsg);
          res.json(result);
        })
      })
    })
  })
})

//DEVELOPMENT ENDPOINT
// @Route PUT  /api/voice/reset
router.put('/reset', (req, res) => {
  Voice.updateMany({}, { talkers: new Map() }, (error, result) => {
    if (error) return res.status(500).send(error.errmsg);
    User.updateMany({}, { currentVoiceChannel: '' }, (error, result) => {
      if (error) return res.status(500).send(error.errmsg);
      res.send(result);
    })
  });
})
module.exports = router;