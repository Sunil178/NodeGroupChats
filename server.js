var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

users = [];
// room = [];
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUserGroupname', function(data) {
      console.log(data);
      
      if(users.indexOf(data.uname) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data.uname);
         // if(room.indexOf(data.room) == -1)
         //    room.push(data.room);
         socket.join(data.room);
         socket.emit('userGroupSet', {username: data.uname, group: data.room});
      }
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.in(data.room).emit('newmsg', data);
   })
});

http.listen(8000, function() {
   console.log('listening on localhost:8000');
});