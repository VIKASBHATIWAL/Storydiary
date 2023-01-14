const express = require("express")
const router = express.Router()
const passport = require('passport')

//@desc Auth with Google
//@route GET /auth/google 

router.get("/google",   passport.authenticate('google', { scope: ['profile'] }))

//@desc Google Auth Callback
//@route GET /auth/google/callback

router.get("/google/callback",  passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/dashboard');
})

//@desc Logout
//@route GET/logout

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



module.exports = router
