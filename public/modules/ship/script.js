(function($){
    $(document).ready(function(){
        var keyRight = 68, // D
            keyLeft = 65, // A
            keyUp = 87, // W
            keyDown = 83; // S
        
        $(window).keydown(function(e) {
            //console.log(event.which);
            switch (event.which) {
                case keyRight:
                    console.log("turn right");
                    break;
                    
                case keyLeft:
                    console.log("turn left");
                    break;
                    
                case keyUp:
                    console.log("accelerate");
                    break;
                    
                case keyDown:
                    console.log("slow down");
                    break;
                    
                default:
                
            }
        });
    });
})(jQuery);


socket.on('sendShip', function(ships) {
    for (var sid in ships) {
        var ship = ships[sid];
        var $s = $('<div><span>'+ship.id+'</span></div>');

        $s.addClass('mod-ship')
            .attr('id','ship–'+ship.id)
            .css({ 
                'left': ship.x+'%',
                'top': ship.y+'%' 
            }).appendTo($('body'));
    }
});

socket.on('removeShip', function(id) {
    console.log('Remove #ship-'+id);
    $('#ship-'+id).remove();
});
