var express = require('express');
var router = express.Router();

// reference the Game model
var Game = require('../models/game');

// auth check
function isLoggedIn(req, res, next)
{
  if (req.isAuthenticated()) {
      next();
  }
  else
  {
      res.redirect('/login');
  }
}

// GET handler for /games
router.get('/', isLoggedIn, function(req, res, next)
{
    // use Game model to run a query
    Game.find(function(err, games)
    {
        if (err)
        {
            console.log(err);
            res.render('error');
        }
        else
        {
            // load the games view
            res.render('games',
            {
                title: 'Video Games',
                games: games,
                user: req.user
            });
        }
    });
});

/* GET /games/add - display empty Game form */
router.get('/add', isLoggedIn, function(req, res, next)
{

    // load the blank game form
    res.render('add-game',
    {
        title: 'Add a New Game',
        user: req.user
    });
});

/* POST /games/add - process form submission */
router.post('/add', isLoggedIn, function(req, res, next)
{
    // use the Game model and call the Mongoose create function
    Game.create(
    {
        title: req.body.title,
        publisher: req.body.publisher,
        genre: req.body.genre,
        year: req.body.year
    },
    function(err, Game)
    {
       if (err)
       {
           console.log(err);
           res.render('error');
       }
       else
       {
         res.redirect('/games');
       }
    });
});

/* GET /games/delete/:_id - run a delete on selected game */
router.get('/delete/:_id', isLoggedIn, function(req, res, next)
{
    // read the id value from the url
    var _id = req.params._id;

    // use mongoose to delete this game
    Game.remove( { _id: _id }, function(err)
    {
      if (err)
      {
       console.log(err);
       res.render('error', {message: 'Delete Error'});
      }
      res.redirect('/games');
    });
});

/* GET /games/:_id - show the edit form */
router.get('/:_id', isLoggedIn, function(req, res, next)
{
    // get the id from the url
    var _id = req.params._id;

    // look up the selected Game document with this _id
    Game.findById(_id,  function(err, game)
    {
      if (err)
      {
          console.log(err);
          res.render('error', { message: 'Could not find Game'});
      }
      else
      {
        // load the edit form
        res.render('edit-game',
        {
            title: 'Edit Game',
            game: game,
            user: req.user
        });
      }
    });
});

/* POST /games/:_id - save form to process Game updates */
router.post('/:_id', isLoggedIn, function(req, res, next)
{
    // get the id from the url
    var _id = req.params._id;

    // instantiate a new Game object & populate it from the form
    var game = new Game(
    {
      _id: _id,
      title: req.body.title,
      publisher: req.body.publisher,
      genre: req.body.genre,
      year: req.body.year
    });

    // save the update using Mongoose
    Game.update( { _id: _id }, game, function(err)
    {
      if (err)
      {
          console.log(err);
          res.render('error', {message: 'Could not Update Game'});
      }
      else
      {
          res.redirect('/games');
      }
    });
});

// make controller public
module.exports = router;
