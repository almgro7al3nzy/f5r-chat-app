const router = require('express').Router();
const url = require('url');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const passport = require('../middlewares/authentication');
const User = require('../models/user');

cloudinary.config({
  cloud_name: 'walkietalkie',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });

// @Route GET /api/user/check
router.get('/check', passport.isLoggedIn(), (req, res) => {
  res.json(req.user);
});

// @Route GET /api/user
router.get('/', (req, res, next) => {
  User.find({}, (findErr, findRes) => {
    if (findErr) next(findErr);

    res.json(findRes);
  })
});

// @Route PUT /api/user
router.put('/', passport.isLoggedIn(), upload.single('photo'), async (req, res, next) => {
  const query = { email: req.user.email };
  const update = { ...req.body };

  if (req.file) {
    await cloudinary.uploader.upload(req.file.path, (error, result) => {
      update.photoURL = result.secure_url;
    });
  }


  User.findOne(query, (error, result) => {
    if (error) return next(error);
    if (update.currentPassword !== undefined) result.comparePassword(update.currentPassword, (error, isMatch) => {
      // if (error) return next(error);
      // if (!isMatch) return res.status(409).send('Wrong password');

      // User.updateOne(query, update, (updateErr, updateRes) => {
      //   if (updateErr) next(updateErr);
        
      //   delete update.currentPassword;
      //   res.json(update);
      // })
      updateUser(error, isMatch, result);
    }); else updateUser(error, true, result);
  });


  const updateUser = (error, isMatch, user) => {
    if (error) return next(error);
    if (!isMatch) return res.status(409).send('Wrong password');
    
    delete update.currentPassword;
    delete update.photo;
    if (update.password !== undefined && update.password.length === 0) delete update.password; //when we change this field to hidden delete this
    if (update.password) {
      user.password = update.password;
      user.save(error => {
        if (error) return next(error);
        res.json(update);
      })
    } else {
      User.updateOne(query, update, (updateErr, updateRes) => {
        if (updateErr) next(updateErr);
        delete update.currentPassword;
        res.json(update);
      })    
    }
  }
})

// @Route PUT /api/user/change-password
router.put('/change-password', (req, res) => {
  User.findOne({ email: req.body.email}, (error, result) => {
    if (error) return res.status(500).send(error);
    
    result.password = req.body.password;
    
    result.save((error, result) => {
      if (error) return res.status(500).send(error);

      res.json(result);
    })
  })
})

// @Route POST /api/user/signup
router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) return res.status(422).send({ error: 'Email is in use!' });

    const newUser = new User({
        displayName: req.body.displayName,
        photoURL: 'https://s.pximg.net/common/images/no_profile.png',
        role: 'Member',
        socketId: null,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save(err => {
      if (err) return next(err);
      res.json({ success: true });
    });
  });  
})

// @Route POST /api/user/signin
router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// @Route POST /api/user/signout
router.post('/signout', (req, res) => {
  req.logout();
  res.status(200).json({ message: "ok" });
})

// @Route GET /api/user/oauth/google
router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// @Router GET /api/user/oauth/google/callback
router.get('/oauth/google/callback', passport.authenticate('google'), (req, res) => {
  console.log('reached call back');
  const host = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });

  res.redirect(`${host}/chat`);
})

module.exports = router;