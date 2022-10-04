const passport = require('passport');


passport.canKick = () => (req, res, next) => (req.user.role === 'Admin'? next() : res.sendStatus(401));

module.exports = passport;