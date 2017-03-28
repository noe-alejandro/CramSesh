module.exports = function(app, passport, LocalStrategy, io, redisClient) {

  var User = require('./models/user');
  var Deck = require('./models/flashcards.js');
  var subjectName;

  // Initiate PassportJS with the LocalStrategy
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

  function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    else {
      console.log('User is attempting to access dashboard without logging in.');
      req.flash('error_msg', 'You are not logged in.');
      res.redirect('/users/login');
    }
  }

  // ******************************
  // ******** GET ROUTES **********
  // ******************************

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/about', function(req, res) {
    res.render('about.ejs');
  });

  app.get('/chatroom', function(req, res) {
    var username = req.user.username;
    console.log(username);
    res.render('chat.ejs');
  });

  app.get('/contact', function(req, res) {
    res.render('contact.ejs');
  });

  app.get('/createdeck', ensureAuthenticated, function(req, res) {
    res.render('createdeck.ejs');
  });

  app.get('/createflashcards', ensureAuthenticated, function(req, res) {
    res.render('createflashcards.ejs');
  });

  app.get('/dashboard', ensureAuthenticated, function(req, res) {
    res.render('dashboard.ejs');
  });

  app.get('/editdecks', ensureAuthenticated, function(req, res) {
    res.render('editdecks.ejs');
  });

  app.get('/editflashcards', ensureAuthenticated, function(req, res) {
    res.render('editflashcards.ejs');
  });

  app.get('/getusername', ensureAuthenticated, function(req, res) {
    res.send({"username" : req.user.username});
  });

  app.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg','You are securely logged out.');
    res.redirect('/users/login');
  });

  app.get('/profile', ensureAuthenticated, function(req, res) {
    res.render('userprofile.ejs');
  });

  app.get('/studyarea', ensureAuthenticated, function(req, res) {
    res.render('study.ejs');
  });

  app.get('/users/login', function(req, res) {
    res.render('login.ejs');
  });

  app.get('/users/register', function(req, res) {
    res.render('register.ejs');
  });

  app.get('/viewdeck', function(req, res) {
    var username = req.user.username;
    Deck.getDecks(username, function(err, data) {
      if(err) {
        console.log(err);
      }
      else {
        var len = data.length;
        var subjectsArray = [];

        for(var i = 0; i < len; ++i) {
          subjectsArray.push(data[i].subject);
        }
      }
      res.send({"subjects" : subjectsArray});
    });
  });

  app.get('/viewcards', function(req, res) {
    res.render('viewcards.ejs');
  });

  // ******************************
  // ******** POST ROUTES *********
  // ******************************
  app.post('/createdeck', ensureAuthenticated, function(req, res) {

    subjectName = req.body.deckName;
    var username = req.user.username;

    Deck.saveDeckName(username, subjectName, function(result) {

    });

    req.flash('deck_msg', 'Your deck has been created!');
    res.render('createflashcards.ejs',
      {
        subject: subjectName,
        deck_msg: req.flash('deck_msg')
      }
    );
  });

  app.post('/createflashcards', ensureAuthenticated, function(req, res) {

    var front = req.body.front;
    var back = req.body.back;
    var username = req.user.username;

    // NOTE: Consider single or double sided flashcards, future feature.
    if(front !== "" || back !== "") {

      Deck.saveFlashcard(username, subjectName, front, back, function() {
      });

      req.flash('flashcard_msg', 'Your flashcard has been saved!');
      res.render('createflashcards.ejs',
        {
          subject: subjectName,
          flashcard_msg: req.flash('flashcard_msg')
        }
      );
    }
    else {

      if(front === "" && back === "") {
        // BOTH CARDS ARE EMTPY
      }
      else if(front === "") {
        // ONLY FRONT CARD EMPTY
      }
      else if(back === "") {
        // ONLY BACK CARD EMPTY
      }
    }
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

      req.flash('success_msg','You are now registered and can login.');
      res.redirect('/users/login');
    }
  });

  app.post('/users/login',
    passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/users/login', failureFlash: true}),
    function(req, res) {
      res.redirect('/dashboard');
    }
  );

  app.post('/viewflashcards', function(req, res) {
    var sub = req.body.deckname;
    var username = req.user.username;

    Deck.getFlashcards(username, sub, function(err, data){
      if(err) {
        console.log(err);
      }
      else {
        console.log("Hello this is before the card info: ");
        console.log(data);
        res.render('viewcards.ejs');
      }
    });
  });

  // SOCKET.IO ROUTES
  io.on('connection', function(socket) {

    // BROADCAST USERNAME THAT CONNECTED
    socket.on('user connection', function(data) {
      socket.username = data.username;
      redisClient.rpush('connectedUsers', socket.username, function(err, replies){
        if(err){
          console.log(err);
        } else {
          console.log(replies);
        }
      });
      redisClient.lrange('connectedUsers', 0, -1, function(err, replies){
        if(err){
          console.log(err);
        } else {
          console.log(replies);
          replies.forEach(function(reply, i){
            console.log(i + " : " + reply);
          });
          io.emit('user connection broadcast', {"users" : replies});
        }
      });
    });

    socket.on('user message', function(data) {
      console.log(data);
      io.emit('user message broadcast', data);
    });

    socket.on('disconnect', function(username) {
      console.log(socket.username + "left chat room");
      redisClient.lrem('connectedUsers', 1, socket.username);

      redisClient.lrange('connectedUsers', 0, -1, function(err, replies) {
        if(err){
          console.log(err);
        } else {
          console.log(replies);
          replies.forEach(function(reply, i){
            console.log(i + " : " + reply);
          });
        }
        io.emit('user disconnect broadcast', {"users" : replies});
      });
    });
  });
};

















//ENDLINE HERE











