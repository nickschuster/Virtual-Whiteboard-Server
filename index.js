// Main server file.

const io = require("socket.io")(3000);

io.on('connect', socket => {

    socket.on('message', data => {
        console.log(data)
    })

})