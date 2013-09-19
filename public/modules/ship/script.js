var xTriggered = 0;
$( "#console" ).keypress(function( event ) {
  if ( event.which == 13 ) {
     event.preventDefault();
  }
  xTriggered++;
  var msg = "Handler for .keypress() called " + xTriggered + " time(s).";
  $.print( msg, "html" );
  $.print( event );
});
 
$( "#other" ).click(function() {
    $( "#target" ).keypress();
});