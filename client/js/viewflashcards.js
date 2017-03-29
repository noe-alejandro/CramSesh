var $main = function() {
  $.ajax({
    method : 'GET',
    url : '/getflashcards',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {
      // Display the flashcards for the subject selected by the
      // user in the dashboard.
       var count = 0;
       var isFront = true;
       var side = "Front";

       $(".page-header").html("Deck name: "+data.deckInfo.subject);
       $("#cardnum").html((count+1)+" of "+data.deckInfo.cards.length);
       $("#cardimage").html(data.deckInfo.cards[count].front);
       $("#cardside").html(side);
       //button to flip card sides.
      $("#flip").on("click",function() {

        if(isFront)
        {
          side = "Back";
          $("#cardimage").html(data.deckInfo.cards[count].back);
          $("#cardside").html(side);
          isFront = false;
        }
        else
        {
          side = "Front";
          $("#cardimage").html(data.deckInfo.cards[count].front);
          $("#cardside").html(side);
          isFront = true;
        }
      });
       //button for next card.
      $("#nextcard").on("click",function() {

        count++;
        side = "Front";
        isFront = true;

        if(count == data.deckInfo.cards.length-1)
        {
          $("#nextcard").prop("disabled",true);
        }

        $("#cardimage").html(data.deckInfo.cards[count].front);
        $("#prevcard").prop("disabled",false);
        $("#cardnum").html((count+1)+" of "+data.deckInfo.cards.length);
        $("#cardside").html(side);
      });

      //button to go back a card.
      $("#prevcard").on("click",function() {
        count--;
        side = "Front";
        isFront = true;

        if(count == 0)
        {
          $("#prevcard").prop("disabled",true);
        }

        $("#cardimage").html(data.deckInfo.cards[count].front);
        $("#nextcard").prop("disabled",false);
        $("#cardnum").html((count+1)+" of "+data.deckInfo.cards.length);
        $("#cardside").html(side);
      });
    }
  });
};
$(document).ready($main);
