var newCardPrompt = $('#newCard');
newCardPrompt.hide();

var $main = function() {

  var numberOfCards = 0;

  var insertCardInfoPrompt = $('#insertCardInfo');

  $('#createFlashcard').on('click', function() {

    var data = {
      front: $('#frontarea').val(),
      back: $('#backarea').val()
    };

    $('#numberOfFlashcards').empty();

    $.ajax({
      method : 'POST',
      url : '/createflashcards',
      data : JSON.stringify(data),
      contentType : 'application/json',
      dataType : 'json',
      success : function(data) {

        ++numberOfCards;
        var flashcardSucessMessageBegin = '<div id="alert" class="alert alert-info fade in">';
        var message = 'Total number of flashcards created: ' + numberOfCards;
        var flashcardSucessMessageEnd = '</div>';
        var insertInfo = flashcardSucessMessageBegin + message + flashcardSucessMessageEnd;
        $('#numberOfFlashcards').append(insertInfo);
      }
    });

    $('#frontarea').val('');
    $('#backarea').val('');
    insertCardInfoPrompt.hide();
    newCardPrompt.show();
  });

  $('#continue').on('click', function() {
    newCardPrompt.hide();
    insertCardInfoPrompt.show();
  });
}
$(document).ready($main);
