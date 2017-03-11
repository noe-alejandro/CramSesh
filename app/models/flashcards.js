var mongoose = require('mongoose');

var FlashcardSchema = mongoose.Schema({

  owner: String,
  subject: String,
  cards: [
    {
      front: String,
      back: String,
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

  console.log(".......in the flashcards.js model......")
  console.log(username);
  console.log(subjectName);
  console.log(front);
  console.log(back);

  Flashcard.findOne({owner: username, subject:subjectName}, function(err, data) {
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
};
