var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    jade = require('jade'),
    lessMiddleware = require('less-middleware'),
    port = 3000;
    
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
     app.use(lessMiddleware({
       src      : __dirname + "/public/modules/space",
       compress : false,
       force: true
     }));
     app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
  res.render('home.jade');
});

server.listen(port);


io.sockets.on('connection', function (socket) {
    
    socket.on('setPseudo', function (data) {
       socket.set('pseudo', data);
    });
    
    socket.on('message', function (message) {
       socket.get('pseudo', function (error, name) {
          var data = { 'message' : message, pseudo : name };
          socket.broadcast.emit('message', data);
          console.log("user " + name + " send this : " + message);
       })
    });
});

console.log('Server runding on Port '+ port);