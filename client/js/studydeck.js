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


      $('.js-flickity').on( 'scroll.flickity', function( event, progress ) {
       $('#currentCard').html(flkty.selectedIndex);
      });

      // FLIP ALGORITHM
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
      });
    }
  });
};
$(document).ready($main);
