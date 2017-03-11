module.exports = function(app, passport, LocalStrategy) {

  var User = require('./models/user');
  var Deck = require('./models/flashcards.js');

  var subjectName;

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/contact', function(req, res) {
    res.render('contact.ejs');
  });

  app.get('/about', function(req, res) {
    res.render('about.ejs');
  });

  app.get('/users/register', function(req, res) {
    res.render('register.ejs');
  });

  app.get('/study', function(req, res) {
    res.render('study.ejs');
  });

  app.get('/editdecks', function(req, res) {
    res.render('editdecks.ejs');
  });

  app.get('/createdeck', function(req, res) {
    res.render('createdeck.ejs');
  });

  app.post('/createdeck', function(req, res) {

    subjectName = req.body.deckName;
    var username = req.user.username;

    Deck.saveDeckName(username, subjectName, function(result) {

    });

    var deck_saved = "Your deck has been created.";
    res.render('createflashcards.ejs', {deck_saved: deck_saved, subject: subjectName});
  });

  app.post('/createflashcards', function(req, res) {

    var front = req.body.front;
    var back = req.body.back;
    console.log("Deck name in post: /createflashcards " + subjectName);
    var username = req.user.username;

    Deck.saveFlashcard(username, subjectName, front, back, function() {

    });


    var card_saved = "Your flashcard has been saved!";
    res.render('createflashcards.ejs', {card_saved: card_saved, subject: subjectName});
  });

  app.post('/users/register', function(req, res) {

    var fullname = req.body.fullname;
    var email =  req.body.email;
    var confirmEmail = req.body.confirmEmail;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    req.checkBody('fullname', 'Full name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();
    req.checkBody('confirmEmail', 'Emails do not match.').equals(req.body.email);
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors) {
      console.log("YES ERRORS");
      console.log(errors);
      console.log(typeof(errors));
      res.render('register.ejs', {errors: errors});
    }
    else {

      console.log('No Errors!');

      var newUser = new User({
        full_name: fullname,
        email: email,
        username: username,
        password: password
      });

      User.createUser(newUser, function(err, user) {
        if(err) throw err;
        console.log(user);
      });

      var success_msg = 'You are now registered and can login.';
      res.render('login.ejs', {success_msg: success_msg});
    }
  });

  app.get('/users/login', function(req, res) {
    res.render('login.ejs');
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      //console.log(username);
     User.getUserByUsername(username, function(err, user) {
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function(err, isMatch) {

        if(err) throw err;

        if(isMatch) {
          return done(null, user);
        }
        else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  app.post('/users/login',
    passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
      res.redirect('/dashboard');
    }
  );

  app.get('/dashboard', ensureAuthenticated, function(req, res) {

    var username = req.user.username;
    console.log("dashboard: " + username);

    res.render('dashboard.ejs');
  });

  function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    else {
      console.log("User is attempting to access dashboard without logging in.");
      var error_message = 'You are not logged in.';
      res.render('login.ejs', {error_message: error_message});
    }
  }

  app.get('/logout', function(req, res) {
    req.logout();
    var success_msg = 'You are securely logged out.';
    res.render('login.ejs', {success_msg: success_msg});
  });
}
