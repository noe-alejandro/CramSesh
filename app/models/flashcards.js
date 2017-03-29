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
  deck.save(callback);
};

Flashcard.saveFlashcard = function(username, subjectName, front, back, callback) {
  Flashcard.findOne({"owner" : username, "subject" : subjectName}, callback);
};

Flashcard.getDecks = function(username, callback) {
  Flashcard.find({"owner": username}, callback);
};

Flashcard.getFlashcards = function(username, subject, callback) {
  Flashcard.findOne({"owner" : username, "subject" : subject}, callback);
};

// ****************************************************************************
// ************************** BEGINNING OF TESTING ****************************
// ****************************************************************************

// NEW Queries for THIRD ITERATION
// FINDS THE DECK, callback contains removal of the card
Flashcard.getSelectedDeck = function(cardID, callback) {
  Flashcard.findById(cardID, callback);
};

// DELETES ENTIRE DECKS - READY FOR DEPLOYMENT
// Research findOneAndRemove ??
Flashcard.removeDeck = function(deckID, callback) {
  Flashcard.findByIdAndRemove(deckID, callback);
};

// UPDATES A CURRENT FLASHCARD
Flashcard.updateFlashcard = function(deckID, cardID, newFront, newBack, callback) {

  Flashcard.findOneAndUpdate({"_id" : deckID, "cards._id" : cardID },
  {
    $set: {"cards.$.front" : newFront, "cards.$.back" : newBack}
  },
  callback);
};

Flashcard.updateDeckName = function(deckID, newSubjectName, callback) {

  Flashcard.findOneAndUpdate({ "_id" : deckID }, { "subject" : newSubjectName}, callback);
};

// ****************************************************************************
// *************************** END OF TESTING *********************************
// ****************************************************************************









