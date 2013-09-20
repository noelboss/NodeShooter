var shipId,
    config;
    
    
(function($){
    
    var createShip = function(ship){

        var $s = $('<div><i></i><i></i><i></i><span>'+ship.id+'</span></div>');
        if(shipId == ship.id){
            $s.addClass('mod-ship-own');
        }
        $s.addClass('mod-ship').addClass('mod-ship-'+ship.id)
            .css({ 
                'left': ship.x+'px',
                'top': ship.y+'px' 
            }).appendTo($('body'));
    }
    
    socket.on('createShips', function(ships) {
        for (var sid in ships) {
            createShip(ships[sid]);
        }
    });
    
    socket.on('createShip', function(ship) {
        createShip(ship);
    });
    
    socket.on('updatePosition', function(ship) {
        $('.mod-ship-'+ship.sid).css({
            'left': ship.x+'px',
            'top': ship.y+'px' 
        });
        
        for(var key in config.keys ){
            $('.mod-ship-'+ship.sid).removeClass('move-'+config.keys[key]);
        }

        $('.mod-ship-'+ship.sid).addClass('move-'+ship.direction);
    });


    socket.on('removeShip', function(id) {
        $('.mod-ship-'+id).remove();
    });
})(jQuery);

