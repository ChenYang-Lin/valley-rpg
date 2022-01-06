const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Socket
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


// Middlewares
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/', express.static(__dirname + "/public"));

SOCKET_LIST = {};

// Routes
app.get("/", (req, res) => {
    res.sendFile("/index.html");
})

server.listen(process.env.PORT || 3000, () => {
    console.log("listen on port 3000");
})
