$('#editcard-form').hide();
$('#addnewcard-form').hide();

var $main = function() {
  $.ajax({
    method : 'GET',
    url : '/editdeck-getdeck',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {

      var flkty = $('.js-flickity').data('flickity');
      var cellElements = $('.js-flickity').flickity('getCellElements');

      $('#deck-name').html(data.subject);
      var numOfCards = data.cards.length;

      $('#totalNumberOfCards').html(numOfCards);

      for(var i = 0; i < numOfCards; ++i)
      {
        var galleryCellBegin = '<div class="gallery-cell">';
        var galleryCaptionBegin = '<div class="gallery-caption"><h4 id="notecard' + i + '">';
        var text = data.cards[i].front;
        var galleryEnd = '</h4></div></div>';
        var $insertCell = $(galleryCellBegin + galleryCaptionBegin + text + galleryEnd);

        $('.js-flickity').flickity('insert', $insertCell, i + 1);
      }

      $('.js-flickity').on( 'scroll.flickity', function(event, progress) {
       $('#currentCard').html(flkty.selectedIndex);
      });


      // **** FLIP ALGORITHM
      $('#flipcard-btn').on('click', function() {
        var notecardIndex = flkty.selectedIndex - 1;
        if(notecardIndex === -1) {
          console.log('Cannot flip this card!');
        }
        else {
          // Get the contents / txt of the slide
          var text = $('#notecard' + notecardIndex).html();

          // Delete the old contents
          $('#notecard' + notecardIndex).empty();

          // Get the front and back data from the data object retrieved from the server
          var front = data.cards[notecardIndex].front;
          var back = data.cards[notecardIndex].back;

          // Compare and insert the contents
          if(front === text) {
            $('#notecard' + notecardIndex).append(data.cards[notecardIndex].back);
          }
          else if(back === text) {
            $('#notecard' + notecardIndex).append(data.cards[notecardIndex].front);
          }
          else {
            console.log("an error has occured.");
          }
        }
      }); // End of Flip Card Algorithm

      // **** EDIT ALGORITHM
      $('#editcard-btn').on('click', function() {

        // Activate the textbox GUI
        $('#editcard-form').show(1000);

        // Get the slide / card index
        var notecardIndex = flkty.selectedIndex - 1;

        // Get the value of the current card
        var text = $('#notecard' + notecardIndex).html();

        // Find whether its the back or front that is being updated
        var front = data.cards[notecardIndex].front;
        var back = data.cards[notecardIndex].back;
        var cardID = data.cards[notecardIndex]._id;
        var deckID = data._id;
        var side;

        if(front === text) {
          $('#side').empty();
          $('#side').html('front');
          side = "front";
        }
        else if(back === text) {
          $('#side').empty();
          $('#side').html('back');
          side = "back";
        }
        else {
          console.log("an error has occured.")
        }

        // Event listen for the send new card info
        $('#newcardinfo-btn').on('click', function() {

          // Hide the textbox
          $('#editcard-form').hide(1000);

          var newCardInfo = $('#newcardinfo').val();

          var newCardData = {
            "deckID" : deckID,
            "cardID" : cardID,
            "side" : side,
            "newInfo" : newCardInfo
          };

          // Send the data for the updated card to the server.
          $.ajax({
            method : 'POST',
            url : '/updateflashcard',
            data : JSON.stringify(newCardData),
            contentType : 'application/json',
            dataType : 'json',
            success : function(newCardData) {
              // Re-fresh the page
              window.location.reload();
            }
          });
        });
      }); // End of Edit Algorithm

      // **** ADD NEW CARD ALGORITHM
      $('#addcard-btn').on('click', function() {

        // Get the deck id
        var deckID = data._id;

        // show form for new card
        $('#addnewcard-form').show(2000);

        $('#addnewcard-btn').on('click', function() {

          var front = $('#newFront').val();
          var back = $('#newBack').val();

          var createNewCardData = {
            "deckID" : deckID,
            "front" : front,
            "back" : back
          };

          // Send the data for the updated card to the server.
          $.ajax({
            method : 'POST',
            url : '/createnewflashcards',
            data : JSON.stringify(createNewCardData),
            contentType : 'application/json',
            dataType : 'json',
            success : function(data) {
              console.log(data.cardCreated);

              // Re-fresh the page
              window.location.reload();
            }
          });
        });
      }); // End of Create New Card

      // DELETE CARD ALGORITHM
      $('#deletecard-btn').on('click', function() {

        // Get the slide / card index
        var notecardIndex = flkty.selectedIndex - 1;

        var cardID = data.cards[notecardIndex]._id;

        // Get the deck id
        var deckID = data._id;

        var deleteDeckID = {
          "deckID" : deckID,
          "cardID" : cardID
        };

        // Send the data for the updated card to the server.
        $.ajax({
          method : 'POST',
          url : '/deleteflashcard',
          data : JSON.stringify(deleteDeckID),
          contentType : 'application/json',
          dataType : 'json',
          success : function(data) {
            // Re-fresh the page
            window.location.reload();
          }
        });
      }); //END of DELETE CARD ALGORITHM
    }
  });
};
$(document).ready($main);
