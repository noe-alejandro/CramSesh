var $main = function() {
  $("#wrapper").toggleClass("toggled");

  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });

};
$(document).ready($main);
