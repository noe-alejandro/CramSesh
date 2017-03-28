var $main = function () {
  $.ajax({
    method : 'GET',
    url : '/viewdeck',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {
      // Random Numbers from 1 to 10
      var randMax = 2;
      var rand = Math.floor((Math.random() * randMax) + 1);
      //var type = ['english', 'science', 'history', 'math'];
      var len = data.subjects.length;

      if(data.subjects.length === 0) {
        var noSubjects = "No decks to display. Create some flashcards in the create flashcards area."
        console.log(noSubjects);
      }
      else {
        for(var i = 0; i < len; i++) {
          // DISPLAY ALL AVAILABLE DECKS
          var startDivTag = '<div class="col-xs-6 col-sm-3 placeholder">';
          var imageTag = '<img src="img/sub_types/1.png" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">';
          var subjectLink = '<button class="btn btn-link">' + data.subjects[i] + '</button>';
          var endDivTag = '</div>';
          var entry = startDivTag + imageTag + subjectLink + endDivTag;
          $('#insert-subjects').append(entry);
        }
      }
      // SEND THE SELECTED DECK FOR SERVER PROCESSING
      $('.btn').on('click', function(event) {
        console.log($(this).html());
        var data = {
          deckname: $(this).html()
        }
        $.ajax({
          method : 'POST',
          url : '/viewflashcards',
          data: JSON.stringify(data),
          contentType : 'application/json'
        });
      });
    }
  });
};
$(document).ready($main);
