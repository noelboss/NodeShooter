var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false }),
    shipFactory = require('./shipFactory.js'),
    jade = require('jade'),
    //lessMiddleware = require('less-middleware'),
    ships = {},
    port = 3000,
    keys = {
        left: 65, // A
        right: 68, // D
        up: 87, // W
        down: 83 // S
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
    ships[socket.id] = shipFactory.newShip(socket.id);
    ships[socket.id].me = true;
    console.log('Ship Connected '+socket.id);
    
    io.sockets.emit ('config', { 'keys': keys });
    
    io.sockets.emit('buildShips', ships);
    
    io.socket.on ('shipMove', function (data) {
        var shipId = data.sid;
        var ship = ships[shipId];
        switch (data.direction) {
            case keys.left:
                console.log(shipId+" left");
                ship.x = ship.x - 10;
                break;
            
            case keys.right:
                console.log(shipId+" right");
                ship.x = ship.x + 10;
                break;
                
            case keys.up:
                console.log(shipId+" up");
                ship.x = ship.y + 10;
                break;
                
            case keys.down:
                console.log(shipId+" down");
                ship.x = ship.y - 10;
                break;
                
            default:
        }
        socket.emit('updatePosition', {sid: shipId, x: ship.x, y: ship.y });
        
    });

    socket.on('disconnect', function () {
        console.info('Disconnect ship ' + socket.id);
        delete ships[socket.id];
        io.sockets.emit ('removeShip', socket.id);
    });
});



console.log('Server runding on Port '+ port);