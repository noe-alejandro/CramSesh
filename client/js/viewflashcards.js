var $main = function() {
  $.ajax({
    method : 'GET',
    url : '/getflashcards',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {
      // Display the flashcards for the subject selected by the
      // user in the dashboard.

      // How to select fields in the deckInfo Object
      console.log(data.deckInfo);
      console.log('subject: ' + data.deckInfo.subject);
      console.log('owner: ' + data.deckInfo.owner);
      console.log('cards: ' + data.deckInfo.cards);
      console.log('cards: ' + typeof(data.deckInfo.cards));
      console.log('cards: ' + data.deckInfo.cards[0].front);
      console.log('cards: ' + data.deckInfo.cards[0].back);








    }
  });
};
$(document).ready($main);
