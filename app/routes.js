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

// ****************************************************************************
// ************************** BEGINNING OF TESTING ****************************
// ****************************************************************************

  // TESTING AREA: Mongoose queries for deleting and updating

  // delete entire deck
  app.get('/removedeck', function(req, res) {

    var deckID = "58db4ab246ab970d718d8883";

    Deck.removeDeck(deckID, function(err, data) {
      if(err) {
        console.log(err);
      }
      else {
        console.log(data);
        res.send(data);
      }
    });
  });

  // delete flashcard
  app.get('/removeflashcard', function(req, res) {

    var deckID = "58db5115eafb710e03af64b4";

    // get the correct deck seleted by the user (ajax call)
    Deck.getSelectedDeck(deckID, function(err, deck) {
      if(err) {
        console.log(err);
      } else {

        // carId will be passed through the ajax call
        var cardID = "58db511eeafb710e03af64b5";

        // find the card with the cardID and remove it
        deck.cards.id(cardID).remove();

        // save the deck
        deck.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("Flashcard was removed!");
          }
        });
      }
    });
  });

  // edit particular flashcard
  app.get('/editflashcard', function(req, res) {

    var deckID = "58db5115eafb710e03af64b4";
    var cardID = "58db5124eafb710e03af64b6";

    var newFront = "You got hacked";
    var newBack = "by yours truly";

    Deck.updateFlashcard(deckID, cardID, newFront, newBack, function(err, data) {
      if(err){
        console.log(err);
      } else {
        console.log(data);
      }
    });
  });

  // edit subject (deck) name
  app.get('/editdeckname', function(req, res) {

    var deckID = "58db5115eafb710e03af64b4";

    var newSubjectName = "You Bitch Made";

    Deck.updateDeckName(deckID, newSubjectName, function(err, data) {
      if(err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
  });

// ****************************************************************************
// *************************** END OF TESTING *********************************
// ****************************************************************************

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

  app.get('/getflashcards', ensureAuthenticated, function(req, res) {

    redisClient.get('subject', function(err, reply) {
      if(err) {
        console.log(err);
      } else {
        var username = req.user.username;
        Deck.getFlashcards(username, reply, function(err, data){
          if(err) {
            console.log(err);
            res.send({"deckInfo" : "MongoDB query failed."});
          }
          else {
            console.log('**** User Card Data *****');
            console.log(data);
            res.send({"deckInfo" : data});
          }
        });
      }
    });
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
        var arr = [];

        for(var i = 0; i < len; ++i) {
          arr.push({
            "subject" : data[i].subject,
            "cover" : data[i].cover
          });
        }
      }
      res.send({"data" : arr});
    });
  });

  app.get('/viewflashcards', function(req, res) {
    res.render('viewflashcards.ejs');
  });

  // ******************************
  // ******** POST ROUTES *********
  // ******************************
  app.post('/createdeck', ensureAuthenticated, function(req, res) {

    subjectName = req.body.deckName;
    var username = req.user.username;
    var cover = req.body.selectCoverPhoto;

    console.log("Cover photo: " + cover);

    Deck.saveDeckName(username, subjectName, cover, function(err, data) {
      if(err) {
        console.log(err);
      }else {
        console.log("Subject and Cover have been saved!\n" + data);
      }
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

      Deck.saveFlashcard(username, subjectName, front, back, function(err, data) {
        if(err) {
          console.log(err);
        }
        else {
          data.cards.push({front: front, back: back});
          data.save(function(err) {
            if(err) {
              console.log(err);
            }
          });
        }
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
    var subject = req.body.deckname;
    redisClient.set('subject', subject, function(err, reply) {
      if(err) {
        console.log(err);
      } else {
        console.log('Redis Reply:' + reply);
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
