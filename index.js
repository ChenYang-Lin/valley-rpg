const express = require("express");
const app = express();
const mongoose = require("mongoose");


// Socket
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const players = {}
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);

    // create a new player and add it to our players object
    players[socket.id] = {
        // flipX: false,
        x: 200,
        y: 200,
        playerId: socket.id,
    };
    // send current players object to only this new player
    socket.emit('currentPlayers', players);
    // update all other players of this new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // When is player disconnects, remove it from all players
    socket.on('disconnect', () => {
        console.log('a user disconnected: ', socket.id);
        
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnected', socket.id);
    })

    // player movement
    socket.on("playerMovement", (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        socket.broadcast.emit("playerMoved", players[socket.id])
    })
})


// Middlewares
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/', express.static(__dirname + "/public"));

SOCKET_LIST = {};

// Routes
app.get("/", (req, res) => {
    res.sendFile("/index.html");
})

server.listen(process.env.PORT || 3000, () => {
    console.log("listen on port 3000");
})
