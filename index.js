// Main server file.

// Networking constants

const HOST = 1
const CLIENT = 0
const STUDENT_ROOM = "student_room"
const JOIN_EVENT = "join_event"
const CREATE_EVENT = "create_event"
const SWITCH_EVENT = "switch_event"
const DRAW_EVENT = "draw_event"

const fs = require("fs")

const options = {
    key: fs.readFileSync("./.openssl/key.pem", "utf-8"),
    cert: fs.readFileSync("./.openssl/cert.pem", "utf-8"),
    passphrase: "test"
}

const server = require("http").createServer()
const io = require("socket.io")(server);
server.listen(3000)
console.log("VW Server Listening ... ")

// Room globals.

let activeCanvas;
let mouseActivity;

io.on('connect', socket => {

    console.log("Connection.")

    // Identify student or teacher
    // If student join student room
    // Remember all students and the teacher
    // Everytime the teacher sends data
    // Send that data to all students

    socket.on(JOIN_EVENT, type => {
        if(type === HOST) {
        } else if(type === CLIENT) {
            socket.join(STUDENT_ROOM)
        }
    })

    socket.on(CREATE_EVENT, () => {
        socket.to(STUDENT_ROOM).emit(CREATE_EVENT)
    })

    socket.on(SWITCH_EVENT, canvasId => {
        socket.to(STUDENT_ROOM).emit(SWITCH_EVENT, canvasId)
    })

    socket.on(DRAW_EVENT, clickData => {
        socket.to(STUDENT_ROOM).emit(DRAW_EVENT, clickData)
    })

})