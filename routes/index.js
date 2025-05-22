const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/user');

// Public Route - login page
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index', { user: req.user });
});

// POST /login -> authenticate user
router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/students',
    failureRedirect: '/',
    failureFlash: true,
  }),
  (req, res) => {
    req.flash('success_msg', 'You are successfully logged in');
    res.redirect('/students');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});

module.exports = router;
