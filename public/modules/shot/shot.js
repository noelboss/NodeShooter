(function($){
    var createShot = function(shot) {
        console.log(shot);
        var $s = $('<i></i>');
        $s.addClass('mod-ship').addClass('mod-ship-'+shot.id)
            .css({ 
                'left': shot.x+'%',
                'top': shot.y+'%' 
            }).appendTo($('body'));
    }
    
    socket.on('buildShots', function(shots) {
        for (var id in shots) {
            createShot(shots[id]);
        }
    });
    
    socket.on('shoot', createShot);
    
    socket.on('updateShot', function(shot) {
        console.log('updateShot .mod-shot-'+shot.sid);
    });
})(jQuery);

