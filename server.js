const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')


app.use(express.static(path.join(__dirname, 'public')))
const botName = 'Chatbot'
//run when a client connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        //Welcome current user
    socket.emit('message',formatMessage(botName,`Welcome ${user.username} to chatRoom`))

    //Brodcast when a user coonect
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has join the chat`))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    })
    
    
    //listen for chat messages
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
    //this runs when a client discoonect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))

            io.to(user.room).emit('roomUser'),{
                room:user.room,
                users:getRoomUsers(user.room)
            }
        }
        
    })
})

const PORT=3000 || process.env.PORT
server.listen(PORT,()=>{console.log(`server is running on ${PORT}`)})