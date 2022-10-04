const router = require('express').Router();

const passport = require('../middlewares/authentication');
const Whiteboard = require('../models/whiteboard');

// @Route - POST /api/whiteboard
router.post('/', passport.isLoggedIn(), (req, res) => {
  Whiteboard.create({ name: req.body.name, artists: [] }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json(result);
  });
});

// @Route - GET /api/whiteboard
router.get('/', passport.isLoggedIn(), (req, res) => {
  Whiteboard.find({}).populate('artists').exec((findErr, findRes) => {
    if (findErr) return res.status(500).send(findErr);
    res.json(findRes);   
  });
});

//@Route - DELETE /api/whiteboard
router.delete('/delete/:channelID', passport.isLoggedIn(), (req, res) => {
  Whiteboard.deleteOne({ _id: req.params.channelID }, (error, result) => {
    if(error) return res.status(500).send(error);
    res.json({result});
  });
});

// @Route - PUT /api/whiteboard/join
router.put('/join', passport.isLoggedIn(), (req, res) => {
  Whiteboard.findOne({name: req.body.name}, (finderr, findres) => {
    if (finderr) return res.status(500).send(finderr);
    if (findres.artists.find(a => a.equals(req.user._id))) return res.status(500).send("Cannot join whiteboard.");
    findres.artists.push(req.user);
    findres.save((error, result) => {
      if(error) return res.status(500).send(error);
      res.send("User added to whiteboard");
    });
  });
});

// @Route - PUT /api/whiteboard/save
router.put('/save', (req, res) => {
  Whiteboard.findOne({ name: req.body.name }, (finderr, findres) => {
    if(finderr) return res.status(500).send(finderr);
    findres.img = req.body.dataURL;
    findres.bgColor = req.body.bgColor;
    findres.save((saveErr, saveRes) => {
      if(saveErr) return res.status(500).send(saveErr);
      res.send("canvas saved");
    });
  });
});

// @Route - GET /api/whiteboard/load
router.get('/load', passport.isLoggedIn(), (req, res) => {
  Whiteboard.findOne({ name: req.query.name }).populate('artists').exec((finderr, findres) => {
    if(finderr) return res.status(500).send(finderr);
    const { name, artists, bgColor, shapes } = findres;
    res.json({ name, artists, bgColor, shapes });
  });
});

// @Route - DELETE /api/whiteboard/leave
router.delete('/leave', passport.isLoggedIn(), (req, res) => {
  console.log('req body', req.body);
  Whiteboard.findOne({name: req.body.name}, (finderr, findres) => {
    console.log('message 1');
    if (finderr) return res.status(500).send(finderr.errmsg);
    console.log('message 2');
    findres.artists = findres.artists.filter(a=> JSON.stringify(a._id) !== JSON.stringify(req.user._id));
    
    if (findres.artists.length === 0) {
      findres.img = req.body.dataURL;
      findres.bgColor = req.body.bgColor;
      console.log('shapes', req.body.shapes);
      findres.shapes = req.body.shapes;
    }

    findres.save((saveErr, saveRes) => {
      console.log('message 3');
      if(saveErr) return res.status(500).send(saveErr.errmsg);
      console.log('message 4');
      res.send("User removed from whiteboard");
    });
  });
});


module.exports = router;