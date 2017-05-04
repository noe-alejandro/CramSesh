var $main = function() {
  $(".card").hide();
  $.ajax({
      method : 'GET',
      url : '/editdeck-getdeck',
      contentType : 'application/json',
      dataType : 'json',
      success : function(data) {


        var len = data.cards.length;

        //store ajax data in another variable.
        var CardData = JSON.parse(JSON.stringify(data.cards));


        //shuffle back with id.
        for(var i = 1; i < len; i++){

          var randNum = Math.floor(Math.random()*i);

          var temp = CardData[i].back;
          CardData[i].back = CardData[randNum].back;
          CardData[randNum].back = temp;

          var temp = CardData[i]._id;
          CardData[i]._id = CardData[randNum]._id;
          CardData[randNum]._id = temp;
        }

        for(var i = 0; i < len; ++i) {

          var tableRowBegin = '<tr>';

          var tableFront0 = '<td  class="" value='+i+' id="tableData' + i +'">'+ data.cards[i].front +'';
          var tableFront1 = '<input type="hidden" id="cardFrontID'+ i +'" name="cardFrontID" value="' + data.cards[i]._id + '">';
          var tableFront2 = '<select id="selectAnswer'+i+'" class="form-control" name="Select Answer">';
          var tableFront3 = '<option selected hidden>Select Option</option>';
          var tableFront4;

           for(var j= 0; j < len; ++j){
            tableFront4 += '<option value="'+CardData[j]._id+'">'+ (j+1) +'.'+ '</option>'
         }

          var tableFront5 = '</select>';
          var tableFront6 = '</td>';

          var tableBack0 = '<td>' + '<span> '+(i+1)+".)  "+' ' ;
          var tableBack1 = ''+ CardData[i].back + ' </span>';
          var tableBack2 = '</td>';

          var tableRowEnd = '</tr>';

          var insert = tableRowBegin + tableFront0 + tableFront1 + tableFront2 + tableFront3 + tableFront4 + tableFront5 + tableFront6 + tableBack0 + tableBack1 + tableBack2 + tableRowEnd;
          $('#insert-deck-info').append(insert);
          tableFront4 = null;
          }

          //compute answers when user submits answers.
       $("#Finish").on('click',function(){
          $("#Finish").fadeOut();
          $(".card").fadeIn();
          var right = 0;
          var wrong = 0;
          for(var i = 0; i < len; ++i){
            if($("#cardFrontID"+i).val() == $("#selectAnswer"+i).val()){
              right++;
              $("#tableData"+i).addClass('bg-success');
            }
            else{
              wrong++;
              $("#tableData"+i).addClass("bg-danger");
            }
          }
          $("#score1").html("correct: "+ right);
          $("#score2").html("wrong: "+ wrong);
        });

        //if user clicks on yes button
       $("#retry").on('click',function(){
          location.reload();
       });
     }
  });
};
$(document).ready($main);
