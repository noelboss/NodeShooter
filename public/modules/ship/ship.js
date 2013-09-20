(function($){
    var shipId,
        config;
    
    socket.on('config', function(conf) {
        config = conf;
        shipId = config.shipId;
    });

    socket.on('buildShips', function(ships) {
        for (var sid in ships) {
            var ship = ships[sid];
            var $s = $('<div><i></i><i></i><i></i><span>'+ship.id+'</span></div>');
            console.log("add Ship "+ship.id);
            if(shipId == ship.id){
                $s.addClass('mod-ship-own');
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
        $('.mod-ship-'+ship.sid).css({ 
            'left': ship.x+'%',
            'top': ship.y+'%' 
        });
        console.log(config);
        
        for(var key in config.keys ){
            $('.mod-ship-'+ship.sid).removeClass('move-'+config.keys[key]);
        }
        console.log('Add .move-'+ship.direction);
        $('.mod-ship-'+ship.sid).addClass('move-'+ship.direction);
    });


    socket.on('removeShip', function(id) {
        console.log('Remove .mod-ship-'+id);
        $('.mod-ship-'+id).remove();
    });
    
    $(document).ready(function(){
        $(window).keydown(function(e) {
            console.log('Keypress: '+e.which);
            if(config.keys.hasOwnProperty(e.which)){
                socket.emit('keyPress', {'sid': shipId, 'key': config.keys[e.which]});
            }
        });
    });
})(jQuery);

