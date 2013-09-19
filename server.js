var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    jade = require('jade'),
    //lessMiddleware = require('less-middleware'),
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
    socket.on('setShipPosition', function(data) {
        console.info('Position received from client: x ' + data.x + ', y ' + data.y);
    });
});

console.log('Server runding on Port '+ port);