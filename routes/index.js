var express = require('express');
var router = express.Router();

// link to the Account model
var Account = require('../models/account');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next)
{
  res.render('index',
  {
    title: 'Lab 5',
    message: 'Authentication with Passport - Part 1',
    user: req.user
  });
});

/* GET register page */
router.get('/register', function(req, res, next)
{
  res.render('register',
  {
    title: 'Register',
    user: req.user
  });
});

/* POST register page */
router.post('/register', function(req, res, next)
{
  // use passport and the Account model to save the new user
  Account.register(new Account( { username: req.body.username }),
    req.body.password, function(err, account)
    {
      if (err)
      {
        console.log(err);
        res.render('error');
      }
      else
      {
        res.redirect('/login');
      }
    });
});

/* GET login page */
router.get('/login', function(req, res, next)
{
  // get session messages if there are any
  var messages = req.session.messages || [];

  res.render('login',
  {
    title: 'Login',
    messages: messages,
    user: req.user
  });

  // clear the messages out of the session
 req.session.messages = null;
});

/* POST login page */
router.post('/login', passport.authenticate('local',
{
  successRedirect: '/games',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'  // stored in session.messages
}));

/* GET logout */
router.get('/logout', function(req, res, next)
{
  req.logout();
  res.redirect('/login');
});

module.exports = router;
