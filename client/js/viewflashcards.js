var $main = function() {
 $.ajax({
   method : 'GET',
   url : '/getflashcards',
   contentType : 'application/json',
   dataType : 'json',
   success : function(data) {
     // Display the flashcards for the subject selected by the
     // user in the dashboard.

      $(".page-header").html("Viewing Deck: " + data.deckInfo.subject);

      for (var i = 0; i < data.deckInfo.cards.length; i++)
      {
        var openDiv = '<div class="col-xs-6 col-md-3 placeholder text-center">';
        var cardtag = '<div class="card">';
        var cardtitle = '<h4 id="cardnum"class="card-title pull-left"><strong>';
        var cardsideDiv = '<div id="cardside'+i+'" class="pull-left"></div>';
        var closetitle = '</strong></h4>';
        var textTag = '<textarea readonly id="cardimage'+i+'" data-value="'+ i +'"  rows="8" class="form-control" type="text" name="front">'+data.deckInfo.cards[i].front+'</textarea readonly>';
        var closeDiv= '</div>';
        var result = openDiv + cardtag + cardtitle + (i+1) + "." + closetitle + textTag + closeDiv + closeDiv;
        $(".ListCards").append(result);
      }

     $(".ListCards textarea").on("click",function() {

        if($("#cardimage"+$(this).data("value")).val() == data.deckInfo.cards[$(this).data("value")].front)
        {
          $("#cardimage"+$(this).data("value")).html(data.deckInfo.cards[$(this).data("value")].back);
        }
        else
        {
          $("#cardimage"+$(this).data("value")).html(data.deckInfo.cards[$(this).data("value")].front);
        }
      });
    }
 });
};
$(document).ready($main);
