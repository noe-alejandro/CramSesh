var $main = function () {

  $.ajax({
    method : 'GET',
    url : '/getdecksInfo',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {

      var len = data.data.length;

      for(var i = 0; i < len; ++i) {
        var tableRowBegin = '<tr id="deck' + i + '">';
        var tableSubject = '<td class="subjectList">' + data.data[i].subject + '</td>';
        var tableCardCount = '<td class="cardCountList">' + data.data[i].cards.length; + '</td>';

        var tableEdit0 = '<td>' + '<form method="POST" action="/editdeck">';
        var tableEdit1 = '<input type="hidden" id="deckID" name="deckID" value="' + data.data[i]._id + '">';
        var tableEdit2 = '<button type="submit" class="btn btn-primary btn-sm">Edit</button>';
        var tableEdit3 = '</form>' + '</td>';

        var tableDelete0 = '<td>' + '<button class="btn btn-danger btn-sm delete-button">Delete</button>';
        var tableDelete1 = '<input type="hidden" value="' + data.data[i]._id + '">';
        var tableDelete2 = '<input type="hidden" value="deck' + i + '">';
        var tableDelete3 = '</td>';

        var tableRowEnd = '</tr>';

        var insert = tableRowBegin + tableSubject + tableCardCount + tableEdit0 + tableEdit1 + tableEdit2 + tableEdit3 + tableDelete0 + tableDelete1 + tableDelete2 + tableDelete3 + tableRowEnd;
        $('#insert-deck-info').append(insert);
      }

      $('.delete-button').on('click', function() {

        var deckID = $(this).next().val();
        var tableRow = $(this).next().next().val();

        $('#' + tableRow).hide('slow', function() {
          $('#' + tableRow).remove();
        });

        var data = {"deckID" : deckID};

        $.ajax({
          method : 'POST',
          url : '/deletedeck',
          data : JSON.stringify(data),
          contentType : 'application/json',
          dataType : 'json',
          success : function(data) {

          }
        });
      });
    }
  });
}
$(document).ready($main);
