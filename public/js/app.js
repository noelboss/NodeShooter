var socket = io.connect();


$(document).ready(function(){
    $(window).keydown(function(e) {
        console.log('Keypress: '+e.which);
        if(config.keys.hasOwnProperty(e.which)){
            socket.emit('keyPress', {'sid': shipId, 'key': config.keys[e.which]});
        }
    });
});

(function($){
    socket.on('config', function(conf) {
        config = conf;
        shipId = config.shipId;
    });
})(jQuery);
