(function($){
    var shipId;
    var keys;
    
    socket.on('config', function(config) {
        keys = config.keys;
    });

    socket.on('buildShips', function(ships) {
        for (var sid in ships) {
            var ship = ships[sid];
            var $s = $('<div><i></i><i></i><i></i><span>'+ship.id+'</span></div>');
            console.log("add Ship "+ship.id);
            if(ship.me){
                $s.addClass('mod-ship-own');
                shipId = sid;
            }
            $s.addClass('mod-ship').addClass('mod-ship-'+ship.id)
                .css({ 
                    'left': ship.x+'%',
                    'top': ship.y+'%' 
                }).appendTo($('body'));
        }
    });
    
    socket.on('updatePosition', function(ship) {
        console.log('Move .mod-ship-'+ship.sid);
        console.log(ship);
        
        $('.mod-ship-'+ship.sid).css({ 
            'left': ship.x+'%',
            'top': ship.y+'%' 
        });
    });
    
    


    socket.on('removeShip', function(id) {
        console.log('Remove .mod-ship-'+id);
        $('.mod-ship-'+id).remove();
    });
    
    $(document).ready(function(){
        $(window).keydown(function(e) {§
            switch (event.which) {
                case keys.left || keys.right || keys.up || keys.down:
                    console.log(shipId+" left");
                    socket.emit('shipMove', {sid: shipId, direction: event.which});
                    break;
                default:
            }
        });
    });
})(jQuery);

