var $main = function() {
  $.ajax({
    method : 'POST',
    url : '/getuserprofile',
    contentType : 'application/json',
    dataType : 'json',
    success : function(data) {

      $('#profile-pic-img').attr('src', data.data.profilePic);
      $('#fullname').html(data.data.name);
      $('#username').html(data.data.username);
      $('#email').html(data.data.email);
    }
  });
};
$(document).ready($main);
