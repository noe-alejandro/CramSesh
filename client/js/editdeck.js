$('#editcard-form').hide();

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

      // FLIP ALGORITHM
      $('#flipcard-btn').on('click', function() {
        var notecardIndex = flkty.selectedIndex - 1;
        console.log(notecardIndex);
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
      });

      // EDIT ALGORITHM
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


        console.log(cardID);
        console.log(deckID);
        var side;

        if(front === text) {
          console.log("This is the front");
          $('#side').empty();
          $('#side').html('front');
          side = "front";
        }
        else if(back === text) {
          console.log("this is the back");
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
          console.log(newCardInfo);
          console.log("card side: " + side);

          var data = {
            "deckID" : deckID,
            "cardID" : cardID,
            "side" : side,
            "newInfo" : newCardInfo
          };

          console.log(data);

          // Send the data for the updated card to the server.
          $.ajax({
            method : 'POST',
            url : '/updateflashcard',
            data : JSON.stringify(data),
            contentType : 'application/json',
            dataType : 'json',
            success : function(data) {

              console.log(data.data);

              // Re-fresh the page
              window.location.reload();

            }
          });
        });
      });
    }
  });
};
$(document).ready($main);
