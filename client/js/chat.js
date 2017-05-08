var $main = function() {

  //var socket = io.connect('http://162.243.128.235:3000');
  var socket = io.connect('http://localhost:3000');
  //var socket = io();

  userConnection(function(data) {
    socket.emit('user connection', data);
  });

  socket.on('user connection broadcast', function(data) {
    $('#users-connections').empty();
    var insertImage;
    var insertUsername;
    var len = data.users.length;
    for(var i = 0; i < len; ++i) {
      insertImage = '<tr><td><span class="glyphicon glyphicon-ok-sign"></span>&nbsp;';
      insertUsername = '<span class="connected-user">' + data.users[i] + '</span></td></tr>';
      var insert = insertImage + insertUsername;
      $('#users-connections').append(insert);
    }
  });

  $('#btn-chat').on('click', function() {
    var userInput = $('#chat-input').val();
    $('#chat-input').val('');
    userConnection(function(data) {
      var userMessage = {
        "user" : data.username,
        "message" : userInput,
        "profileImage" : data.profileImage
      };
      socket.emit('user message', userMessage);
    });
  });

  $('#chat-input').on('keypress', function(event) {
    if(event.keyCode === 13) {
      var userInput = $('#chat-input').val();
      $('#chat-input').val('');
      userConnection(function(data) {
        var userMessage = {
          "user" : data.username,
          "message" : userInput,
          "profileImage" : data.profileImage
        };
        socket.emit('user message', userMessage);
      });
    }
  });

  socket.on('user message broadcast', function(data) {
    var time = new Date();
    var currentTime = time.getHours() + 'h:' + time.getMinutes() + 'm:' + time.getSeconds() + 's';
    var listBegin = '<li class="left clearfix">';
    var spanBegin = '<span class="chat-img pull-left">';
    var image = '<img src="' + data.profileImage + '" alt="User Avatar" height="55" width="55" class="img-circle" />';
    var spanEnd = '</span>';
    var chatBodyBegin = '<div class="chat-body clearfix">';
    var chatHeaderBegin = '<div class="header">';
    var strongUsername = '<strong class="primary-font">' + data.user + '</strong>';
    var smallMutedBegin = '<small class="pull-right text-muted">';
    var glyph = '<span class="glyphicon glyphicon-time"></span>';
    var timeSent = currentTime;
    var smallMutedEnd = '</small>';
    var chatHeaderEnd = '</div>'
    var messageParaBegin = '<p>';
    var userMessage = data.message;
    var messageParaEnd = '</p>';
    var chatBodyEnd = '</div>';
    var listEnd = '</li>';
    var insertMessage = listBegin + spanBegin + image + spanEnd + chatBodyBegin;
    insertMessage += chatHeaderBegin + strongUsername + smallMutedBegin + glyph;
    insertMessage += timeSent + smallMutedEnd + chatHeaderEnd + messageParaBegin;
    insertMessage += userMessage + messageParaEnd + chatBodyEnd + listEnd;
    $('#chat').append(insertMessage);
  });

  socket.on('user disconnect broadcast', function(data) {
    $('#users-connections').empty();
    var insertImage;
    var insertUsername;
    var len = data.users.length;
    for(var i = 0; i < len; ++i) {
      insertImage = '<tr><td><span class="glyphicon glyphicon-ok-sign"></span>&nbsp;';
      insertUsername = '<span class="connected-user">' + data.users[i] + '</span></td></tr>';
      var insert = insertImage + insertUsername;
      $('#users-connections').append(insert);
    }
  });

  function userConnection(callback) {
    $.ajax({
      method : 'GET',
      url : '/getusername',
      contentType : 'application/json',
      dataType : 'json',
      success : function (data) {
        callback(data);
      }
    });
  }
};
$(document).ready($main);
