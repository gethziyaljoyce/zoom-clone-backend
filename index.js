const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

//for real time communication
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//cors
app.use(cors());

//port to display
const PORT = process.env.PORT || 5000;

//middleware
app.get("/", (req, res) => {
    res.send("Server is running");
});

//connection
io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name })
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});

//server start
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
