var mongoose = require('mongoose');

var FlashcardSchema = mongoose.Schema({

  owner: String,
  subject: String,
  cards: [
    {
      front: String,
      back: String,
      cardID: Number
    }
  ]
});

var Flashcard = module.exports = mongoose.model('Flashcard', FlashcardSchema);

Flashcard.saveDeckName = function(username, subjectName, callback) {

  var deck = new Flashcard();

  deck.owner = username;
  deck.subject = subjectName;
  deck.save();
};

Flashcard.saveFlashcard = function(username, subjectName, front, back, callback) {


  // Find the most recent card in the deck.
  /*deck.findOne().sort({'coutID': -1}).exe(function(err, data) {

    if(err) {
      console.log('Error: not found!');
    }
    else {
    }
  });*/

  /*deck.findOne(
    {
      owner: username,
      subject: subjectName
    },
    {

    }
  )*/
};
