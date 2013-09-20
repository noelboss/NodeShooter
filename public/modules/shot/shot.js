(function($){
    socket.on('createShot', function(ships) {
        for (var sid in ships) {
            var ship = ships[sid];
            var $s = $('<i></i>');
            $s.addClass('mod-ship').addClass('mod-ship-'+ship.id)
                .css({ 
                    'left': ship.x+'%',
                    'top': ship.y+'%' 
                }).appendTo($('body'));
        }
    });
    
    socket.on('updatePosition', function(ship) {
        console.log('Move .mod-ship-'+ship.sid);
        $('.mod-ship-'+ship.sid).css({ 
            'left': ship.x+'%',
            'top': ship.y+'%' 
        });
        for(var key in config.keys ){
            $('.mod-ship-'+ship.sid).removeClass('move-'+config.keys[key]);
        }
        console.log('Add .move-'+ship.direction);
        $('.mod-ship-'+ship.sid).addClass('move-'+ship.direction);
    });
})(jQuery);

