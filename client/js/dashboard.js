var $main = function () {

  $('#createDeckContainer').hide();
  $('#createCardContainer').hide();

  $('#createDeck').on('click', function () {

    $('#createNewFlashcardDeckButton').hide('slow');
    $('#createDeckContainer').show('slow');

    $('#submitDeckName').on('click', function () {

      var deckName = $('#deckName').val();

      // Creating JSON object to store into the database
      var deckSubject = {"subject": deckName};

      var insertDeckName = $('<p>').text(deckName);
      $('#displayDeckName').append(insertDeckName);

      $('#createDeckContainer').hide('slow');
      $('#createCardContainer').show('slow');

      $.ajax({
        method : 'POST',
        url : '/process/deckname',
        contentType : 'application/json',
        data : JSON.stringify(deckSubject),
        dataType : 'json',
        success : function(response) {
          console.log(response.message);
        }
      });

      $('#createNewCard').on('click', function() {
        // SUBMIT QUERY TO DATABSE
        // Re-render the FRONT and BACK Portion

        var front = $('#front').val();
        var back = $('#back').val();

        console.log("front: " + front);
        console.log("back: " + back);
        console.log("deck name: " + deckName);

        var flashCard = {
          "subject" : deckName,
          "side" : {
            "front": front,
            "back" : back
          }
        };

        $.ajax({
          method : 'POST',
          url : '/process/cardinfo',
          contentType : 'application/json',
          data : JSON.stringify(flashCard),
          dataType : 'json',
          success : function(response) {
            console.log(response.message);
            var savedCardConfirm = $('<p>').text(response.message);
            $('#cardStatus').append(savedCardConfirm);
          }
        });

        $('#front').val('');
        $('#back').val('');
      });

      //DONE BUTTON --- NEED TO FIGURE THIS OUT ----

      /*$('#done').on('click', function() {
        $('#createDeckContainer').hide('slow');
        $('#createCardContainer').hide('slow');
        $('#createNewFlashcardDeckButton').show('slow');


        $('#front').val('');
        $('#back').val('');
        //SUBMIT QUERY TO DATABASE
        // Re-renderr the dashboard and display the new deck.
      });*/
    });
  });
};

$(document).ready($main);
