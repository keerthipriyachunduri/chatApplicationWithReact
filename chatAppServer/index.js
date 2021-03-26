const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const PORT = process.env.PORT || 5000;
const router = require('./router');
const app = express();

app.use(cors);
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
        origin: '*',
      }
});


io.on("connection",(socket) =>{
    console.log("connection created");
    socket.on('join',({name,room},callback)=>{
        
        const {error,user} = addUser({id:socket.id,name:name,room:room});
        
        if(error) return callback(error);
        socket.emit('message',{user:'admin' , text:`${user.name} welcome to the room`});
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined  the chat`});
        socket.join(user.room);
        io.to(user.room).emit('roomData',{room:user.room,users: getUsersInRoom(user.room)});
        
        
    })

    socket.on('sendMessage',(message,callback)=>{
        console.log(socket.id);
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message',{user:user.name,text:message});
        console.log(getUsersInRoom(user.room));
        io.to(user.room).emit('roomData',{room: user.room, users: getUsersInRoom(user.room)});
 
        callback();

    });
    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left`});
        }
    })
})  



app.use(router);
server.listen(PORT,()=> console.log(' server is up and running '+ server.address().port));