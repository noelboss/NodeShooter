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
    speed = 3,
    keys = {
        65: "left", // A
        68: "right", // D
        87: "down", // W
        83: "up", // S
        32: "shoot" // space
    };


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
        console.log("Key Press: "+data.key);
        switch (data.key) {
            case 'left':
                ship.x = ship.x - speed;
                move = true;
                break;
            
            case 'right':
                ship.x = ship.x + speed;
                move = true;
                break;
                
            case 'up':
                ship.y = ship.y + speed;
                move = true;
                break;
                
            case 'down':
                ship.y = ship.y - speed;
                move = true;
                break;
            
            case 'shoot':
                shots[ship.id] = shotFactory.newShot(ship);
                io.sockets.emit('shoot', shots[ship.id]);
                break;
                
            default:
        }
        if(move){
            ship.direction = data.key;
            io.sockets.emit('updatePosition', {sid: shipId, x: ship.x, y: ship.y, direction: ship.direction });
        }
    });

    socket.on('disconnect', function () {
        delete ships[socket.id];
        io.sockets.emit ('removeShip', socket.id);
    });
});



console.log('Server runding on Port '+ port);