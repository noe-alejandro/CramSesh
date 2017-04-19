var $main = function () {
  $.ajax({
    method : 'GET',
    url : '/viewdeck',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {

      var covers = ['Blank Flashcard', 'English', 'Mathematics', 'Science', 'History'];
      var len = data.data.length;

      if(data.data.length === 0) {
        var noSubjects = "No decks to display. Create some flashcards in the create flashcards area."
        console.log(noSubjects);
        var noDecksImage = '<img src="img/nodecksaboutit.png" class="img-responsive" alt="No Decks To Display">';
        $('#no-decks').append(noDecksImage);

      }
      else {
        for(var i = 0; i < len; i++) {
          // Get the index of the image in the covers array
          var image = covers.indexOf(data.data[i].cover);

          // DISPLAY ALL AVAILABLE DECKS
          var startDivTag = '<div class="col-xs-4 col-md-2 placeholder text-center">';
          var imageTag = '<img src="img/sub_types/' + image + '.png"' + 'width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">';
          var subjectLink = '<h4><a href="/viewflashcards" class="getFlashcards">' + data.data[i].subject + '</a></h4>';
          var endDivTag = '</div>';
          var entry = startDivTag + imageTag + subjectLink + endDivTag;
          $('#insert-subjects').append(entry);
        }
      }
      // SEND THE SELECTED DECK FOR SERVER PROCESSING
      $('.getFlashcards').on('click', function(event) {
        console.log($(this).html());
        var data = {
          deckname: $(this).html()
        }
        $.ajax({
          method : 'POST',
          url : '/viewflashcards',
          data : JSON.stringify(data),
          contentType : 'application/json',
          dataType : 'json',
          success : function(data) {
            console.log(data.redis);
          }
        });
      });
    }
  });
};
$(document).ready($main);
