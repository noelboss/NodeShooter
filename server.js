var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    shipFactory = require('./public/modules/ship/shipFactory.js'),
    jade = require('jade'),
    //lessMiddleware = require('less-middleware'),
    ships = [],
    port = 3000;
    

    
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
    var ship = shipFactory.newShip();
    ships.push(ship);
    console.log(ships);
    res.render('home.jade');
});

server.listen(port);

io.sockets.on('connection', function (socket) {
    
    io.sockets.emit ('sendShip', ships);
});

console.log('Server runding on Port '+ port);