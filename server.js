var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false }),
    shipFactory = require('./shipFactory'),
    shotFactory = require('./shotFactory'),
    jade = require('jade'),
    ships = {},
    shots = {},
    port = 3000,
    boostduration = 300,
    maxSpeed = 5,
    minSpeed = 1,
    keys = {
        65: "left", // A
        68: "right", // D
        83: "up", // S
        87: "down", // W
        37: "left", // Arrow left
        39: "right", // Arrow right
        40: "up", // Arrow up
        38: "down", // Arrow down
        32: "shoot" // space
    };
    
    /*
var child_process = require('child_process');
setTimeout(function () {
    child_process.fork('./long-running', [start]);
}, 1000);
*/


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
    res.render('home.jade');
});

server.listen(port);


var moveShip = function(ship){
    if ( ship.speed > minSpeed){
        ship.speed = ship.speed - (ship.move / 5);
    }
    if(ship.speed < minSpeed){
        ship.speed = minSpeed;
    }
    ship.move--;
    if(ship.move > 0){
        switch (ship.direction) {
            case 'left':
                ship.x = ship.x - ship.speed;
                break;
            
            case 'right':
                ship.x = ship.x + ship.speed;
                break;

            case 'up':
                ship.y = ship.y + ship.speed;
                break;
                
            case 'down':
                ship.y = ship.y - ship.speed;
                break;

        }
        
        io.sockets.emit('updatePosition', ship);
        
        moveShip(ship);
    } else {
        ship.moving = false;
    }
}

io.sockets.on('connection', function (socket) {

    socket.emit ('config', { 
        'keys': keys,
        'shipId': socket.id
    });
    
    socket.emit('createShips', ships);
    socket.emit('createShots', shots);
    
    var newShip = shipFactory.newShip(socket.id);
    io.sockets.emit('createShip', newShip);
    ships[socket.id] = newShip;
    
    socket.on('keyPress', function(data) {
        var shipId = data.sid;
        var ship = ships[shipId];
        var move = false;

        switch (data.key) {
            case 'left':
                move = true;
                break;
            
            case 'right':
                move = true;
                break;
                
            case 'up':
                move = true;
                break;
                
            case 'down':
                move = true;
                break;
            
            case 'shoot':
                shots[ship.id] = shotFactory.newShot(ship);
                io.sockets.emit('shoot', shots[ship.id]);
                break;
        }
        if(move){
            ship.direction = data.key;
            ship.move = ship.move + boostduration;
            ship.speed = ship.speed + 1;
            if(ship.moving == false){
                moveShip(ship);
            }
        }
    });

    socket.on('disconnect', function () {
        delete ships[socket.id];
        io.sockets.emit ('removeShip', socket.id);
    });
});



console.log('Server runding on Port '+ port);
