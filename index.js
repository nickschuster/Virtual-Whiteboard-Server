// Main server file.

// Networking constants

const HOST = 1
const CLIENT = 0
const ROOM = "room"
const STUDENT_ROOM = "student_room"
const JOIN_EVENT = "join_event"
const CREATE_EVENT = "create_event"
const SWITCH_EVENT = "switch_event"
const DRAW_EVENT = "draw_event"
const RENAME_EVENT = "rename_event"
const DELETE_EVENT = "delete_event"
const HISTORY_EVENT = "history_event"
const ROOM_EVENT = "room_event"
const QUESTION_EVENT = "question_event"

const fs = require("fs")
const { connected, exit } = require("process")

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

let roomHistory = [];
let roomList = [];
let questionId = 0;
let connectedClients = 0

io.on('connect', socket => {

    connectedClients += 1
    console.log("Connection. Total: " + connectedClients)

    // Identify student or teacher
    // If student join student room
    // Remember all students and the teacher
    // Everytime the teacher sends data
    // Send that data to all students

    socket.on(JOIN_EVENT, joiner => {
        console.log("Connection: " + joiner.type);
        if(joiner.type === HOST) {
        } else if(joiner.type === CLIENT) {
            socket.join(STUDENT_ROOM);
            sendHistory(socket)
        }
        addToRoom(joiner, socket)
        io.in(ROOM).emit(ROOM_EVENT, roomList)
    })

    socket.on(CREATE_EVENT, () => {
        socket.to(STUDENT_ROOM).emit(CREATE_EVENT);
        addToHistory(CREATE_EVENT, undefined)
    })

    socket.on(SWITCH_EVENT, canvasId => {
        socket.to(STUDENT_ROOM).emit(SWITCH_EVENT, canvasId);
        addToHistory(SWITCH_EVENT, canvasId)
    })

    socket.on(DRAW_EVENT, clickData => {
        socket.to(STUDENT_ROOM).emit(DRAW_EVENT, clickData);
        addToHistory(DRAW_EVENT, clickData)
    })

    socket.on(RENAME_EVENT, renameDetails => {
        socket.to(STUDENT_ROOM).emit(RENAME_EVENT, renameDetails);
        addToHistory(RENAME_EVENT, renameDetails)
    })

    socket.on(DELETE_EVENT, canvasId => {
        socket.to(STUDENT_ROOM).emit(DELETE_EVENT, canvasId);
        addToHistory(DELETE_EVENT, canvasId)
    })

    socket.on(HISTORY_EVENT, () => {
        sendHistory(socket)
    })

    socket.on(QUESTION_EVENT, question => {
        console.log()
        questionId += 1
        io.in(ROOM).emit(QUESTION_EVENT, {
            questionId: questionId,
            question: question
        })
    })

    socket.on("disconnect", reason => {
        console.log("Disconnection: " + reason);
        connectedClients -= 1;
        removeFromRoom(socket.id, socket)
    })
})

// Save an event to the history.
function addToHistory(event, details) {
    roomHistory.push({type: event, detail: details})
}

// Send all current room history to the new joiner.
function sendHistory(socket) {
    for(const event of roomHistory) {
        socket.emit(event.type, event.detail)
    }
}

// Add someone to the room.
function addToRoom(joiner, socket) {
    console.log(socket.id)
    roomList.push({
        id: socket.id,
        joiner: joiner
    })
    socket.join(ROOM)
}

// Remove someone from the room.
function removeFromRoom(id, socket) {
    for(let i = 0; i < roomList.length; i++) {
        if(roomList[i].id == id) {
            roomList.splice(i, 1);
        }
    }
    socket.to(ROOM).emit(ROOM_EVENT, roomList)
}

// setInterval(() => {
//     if(connectedClients === 0) {
//         console.log("No clients connected. Shutting down.")
//         io.close()
//         exit()
//     }
// }, 30000)
