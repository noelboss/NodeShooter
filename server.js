var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false }),
    shipFactory = require('./shipFactory.js'),
    jade = require('jade'),
    //lessMiddleware = require('less-middleware'),
    ships = {},
    port = 3000;



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
    console.log('Ship Connected '+socket.id);
    
    io.sockets.emit ('sendShip', ships);
});

io.sockets.on('disconnect', function(socket) {
    console.log('disconnect '+socket.id);
    io.sockets.emit ('removeShip', socket.id);
});

console.log('Server runding on Port '+ port);