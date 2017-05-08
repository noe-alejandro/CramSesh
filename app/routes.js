module.exports = function(app, passport, LocalStrategy, io, redisClient, upload, cloudinary) {

  var User = require('./models/user');
  var Deck = require('./models/flashcards.js');
  var fs = require('fs');

  var subjectName;
  var deckID;

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
// *********************** BEGINNING OF HTTP GET ROUTES ***********************
// ****************************************************************************

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

  app.get('/editdeck', ensureAuthenticated, function(req, res) {
    res.render('editdeck.ejs');
  });

  app.get('/editdeck-getdeck', ensureAuthenticated, function(req, res) {
    console.log(deckID);
    Deck.getSelectedDeck(deckID, function(err, data) {
      if(err) {
        console.log(err);
      }
      else {
        res.send(data);
      }
    });
  });

  app.get('/editflashcards', ensureAuthenticated, function(req, res) {
    res.render('editflashcards.ejs');
  });

  app.get('/getdecksInfo', ensureAuthenticated, function(req, res) {
    var username = req.user.username;

    Deck.getDecks(username, function(err, data) {

      if(err) {
        console.log(err);
      }
      else {
        res.send({"data" : data});
      }
    });
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
    res.send(
      {
        "username" : req.user.username,
        "profileImage" : req.user.profile_pic
      });
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

  app.get('/viewdeck', ensureAuthenticated, function(req, res) {
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

  app.get('/viewflashcards', ensureAuthenticated, function(req, res) {
    res.render('viewflashcards.ejs');
  });

// ****************************************************************************
// ********************** BEGINNING OF HTTP POST ROUTES ***********************
// ****************************************************************************

  app.post('/contactteam', function(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var userMessage = req.body.userMessage;
    console.log('*************************');
    console.log('****** New Message ******');
    console.log('*************************');
    console.log('From: ' + name);
    console.log('Email:' + email);
    console.log('Message Text: ' + userMessage);
    console.log('*************************');
    console.log('***** End of Message ****');
    console.log('*************************');


    req.flash('success_msg', 'Your message has been sent. Please wait 24 hours for an email response.');
    res.redirect('/contact');
  });

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

    req.flash('deck_msg', 'Flashcard Deck Name: ' + subjectName);
    res.render('createflashcards.ejs',
      {
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

      // This is not really doing anything, just console log on the client side.
      req.flash('flashcard_msg', 'Your flashcard has been saved!');
      res.send(
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

  app.post('/createnewflashcards', function(req, res) {

    // Get username
    var username = req.user.username;

    // Get data from the client
    var deckID = req.body.deckID;
    var front = req.body.front;
    var back = req.body.back;
    //console.log(username);
    console.log(deckID);
    console.log(front);
    console.log(back);

    Deck.saveNewFlashcard(deckID, front, back, function(err, data) {
      if(err) {
        console.log(err);
      }
      else {
        console.log(data);
        data.cards.push({front: front, back: back});
        data.save(function(err) {
          if(err) {
            console.log(err);
          }
          else {
            res.send({"cardCreated" : "New card has been created!"});
          }
        });
      }
    });
  });

  app.post('/deletedeck', function(req, res) {

    var id = req.body.deckID;
    console.log(id);

    Deck.removeDeck(id, function(err, data) {
      if(err) {
        console.log('MongoDB query failed, please check errors:\n' + err);
      }
      else {
        console.log('Deck has been deleted: ' + data);
      }
    });
  });

  // delete flashcard
  app.post('/deleteflashcard', function(req, res) {

    var deckID = req.body.deckID;
    var cardID = req.body.cardID;

    // get the correct deck seleted by the user (ajax call)
    Deck.getSelectedDeck(deckID, function(err, deck) {
      if(err) {
        console.log(err);
      } else {

        // find the card with the cardID and remove it
        deck.cards.id(cardID).remove();

        // save the deck
        deck.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("Flashcard was removed!");
            res.send({"cardDelete" : "Flashcard has been delete!"});
          }
        });
      }
    });
  });

  app.post('/editdeck', function(req, res) {
    deckID = req.body.deckID;
    console.log(deckID);
    res.render('editdeck.ejs');
  });

  app.post('/matching', function(req, res) {
    deckID = req.body.deckID;
    console.log(deckID);
    res.render('matching.ejs');
  });

  app.post('/studydeck', function(req, res) {
    deckID = req.body.deckID;
    console.log(deckID);
    res.render('studydeck.ejs');
  });

  app.post('/updateflashcard', function(req, res) {

    var updateDeckID = req.body.deckID;
    var updateCardID = req.body.cardID;
    var cardSide = req.body.side;
    var newCardInfo = req.body.newInfo;

    console.log(updateDeckID);
    console.log(updateCardID);
    console.log(cardSide);
    console.log(newCardInfo);

    if(cardSide === 'front') {
      // Update the database with new front info
      Deck.updateFrontFlashcard(updateDeckID, updateCardID, newCardInfo, function(err, data) {
        if(err) {
          console.log(err);
        }
        else {
          console.log('New card front side info has been saved!');
          console.log(data);

          // Send confirmation to the client
          res.send({"data" : 'Your new front side has been saved! :)'});
        }
      });
    }
    else if(cardSide === 'back') {
      // Update the database with new back info
      Deck.updateBackFlashcard(updateDeckID, updateCardID, newCardInfo, function(err, data) {
        if(err) {
          console.log(err);
        }
        else {
          console.log('New card back side info has been saved!');
          console.log(data);

          // Send confirmation to the client
          res.send({"data" : 'Your new back side has been saved! :)'});
        }
      });
    }
    else {
      console.log('An error has occured');
    }
  });

  app.post('/getuserprofile', ensureAuthenticated, function(req, res) {
    var userProfile = {
      "name" : req.user.full_name,
      "username" : req.user.username,
      "email" : req.user.email,
      "profilePic" : req.user.profile_pic
    };
    res.send({"data" : userProfile});
  });

  app.post('/uploadimage', upload.any(), function(req, res) {

    // GET THE NAME OF THE FILE THAT WAS UPLOADED
    var imageName = req.files[0].originalname;
    console.log(imageName);

    var imagePath = './temp_files/' + imageName;
    console.log(imagePath);

    //upload the new image
    cloudinary.uploader.upload(imagePath, function(result)
    {
      console.log(result);
      console.log('cloudinary result url: ' + result.url);

      //update mongoDB profile_pic for the user
      var username = req.user.username;
      User.updateProfilePic(username, function(err, data) {
        if(err) {
          console.log(err);
        } else {

          data.profile_pic = result.url;

          data.save(function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log('profile pic has been saved!');
            }
          });
        }
      });
    },
    { public_id: req.user.username }
    );

    // delete the image from the server
    fs.unlink(imagePath);

    res.redirect('/profile');
  });

  app.post('/users/register', function(req, res) {

    var fullname = req.body.fullname;
    var email =  req.body.email;
    var confirmEmail = req.body.confirmEmail;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var defaultProfilePic = 'http://res.cloudinary.com/dlsqyyz1p/image/upload/v1493944290/emptyprofile_yf77gi.jpg';

    req.checkBody('fullname', 'Full name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();
    req.checkBody('confirmEmail', 'Emails do not match.').equals(req.body.email);
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors) {
      console.log('Form contains errors. Do not process!');
      console.log(errors);
      console.log(typeof(errors));
      res.render('register.ejs', {errors: errors});
    }
    else {

      console.log('Form contains no errors. Ready for processing..');

      var newUser = new User({
        full_name: fullname,
        email: email,
        username: username,
        password: password,
        profile_pic: defaultProfilePic
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

// ****************************************************************************
// *********************** BEGINNING OF SOCKET.IO ROUTES ***********************
// ****************************************************************************

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
