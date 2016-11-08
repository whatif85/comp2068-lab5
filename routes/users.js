var express = require('express');
var router = express.Router();

var passport = require('passport');
// link to your existing Account model
var Account = require('../models/account');

/* auth check */
// make this route private so only authenticated users can access it
function isLoggedIn(req, res, next)
{
  if (req.isAuthenticated())
  {
      next();
  }
  else
  {
      res.redirect('/login');
  }
}

/* GET users listing. */
// modify the route handler for GET requests at /users
// so that it queries your database using your Account model
// and fetches a list of all users
router.get('/', isLoggedIn, function(req, res, next)
{
  Account.find(function(err, accounts) {
    if (err)
    {
      console.log(err);
      res.render('error');
    }
    else
    {
      // load the games view
      res.render('users',
      {
          title: 'Users',
          users: accounts,
          // show username as in 'signed in as ___'
          user: req.user
      });
    }
  });
});

module.exports = router;
