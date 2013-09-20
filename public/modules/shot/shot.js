(function($){
    var createShot = function(shot) {
        console.log(shot);
        var $s = $('<i></i>');
        $s.addClass('mod-shot').addClass('mod-shot-'+shot.id)
            .css({ 
                'left': shot.x+'px',
                'top': shot.y+'px' 
            }).appendTo($('body'));
    }
    
    socket.on('createShots', function(shots) {
        for (var id in shots) {
            createShot(shots[id]);
        }
    });
    
    socket.on('shoot', createShot);
    
    socket.on('updateShot', function(shot) {
        console.log('updateShot .mod-shot-'+shot.sid);
    });
})(jQuery);

