var $main = function () {
$.ajax({
    method : 'GET',
    url : '/getdecksInfo',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {

      var len = data.data.length;

      console.log(data.data);

      for(var i = 0; i < len; ++i) {
        var tableRowBegin = '<tr id="deck' + i + '">';
        var tableSubject = '<td class="subjectList">' + data.data[i].subject + '</td>';
        var tableCardCount = '<td class="cardCountList">' + data.data[i].cards.length; + '</td>';

        var tableStudy0 = '<td>' + '<form method="POST" action="/studydeck">';
        var tableStudy1 = '<input type="hidden" id="deckID" name="deckID" value="' + data.data[i]._id + '">';
        var tableStudy2 = '<button type="submit" class="btn btn-primary btn-sm">Select</button>';
        var tableStudy3 = '</form>' + '</td>';

        var tableMatch0 = '<td>' + '<form method="POST" action="/matching">';
        var tableMatch1 = '<input type="hidden" id="deckID" name="deckID" value="' + data.data[i]._id + '">';
        var tableMatch2 = '<button type="submit" class="btn btn-primary btn-sm">Select</button>';
        var tableMatch3 = '</form>' + '</td>';

        var tableRowEnd = '</tr>';

        var insert = tableRowBegin + tableSubject + tableCardCount + tableStudy0 + tableStudy1 + tableStudy2 + tableStudy3 + tableMatch0 + tableMatch1 + tableMatch2 + tableMatch3 + tableRowEnd;
        $('#insert-deck-info').append(insert);
      }
    }
  });
}

$(document).ready($main);
