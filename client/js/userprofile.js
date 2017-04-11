var $main = function() {
  $.ajax({
    method : 'GET',
    url : '/getuserprofile',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {
      $('#fullname').html(data.data.name);
      $('#username').html(data.data.username);
      $('#email').html(data.data.email);
    }
  });
};
$(document).ready($main);
