var $main = function() {

  // external js: flickity.pkgd.js

  var $carousel = $('.carousel').flickity({
    initialIndex: 1
  });

  $carousel.on( 'staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
    if ( cellElement ) {
      $carousel.flickity( 'remove', cellElement );
    }
  });
};
$(document).ready($main);
