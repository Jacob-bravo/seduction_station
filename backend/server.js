const app = require("./app");
const User = require("./models/UserModel");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDatabase = require("./config/database");
const Message = require("./models/Message");
const axios = require("axios");
const firebaseAdmin = require("firebase-admin");

// Setting up config file
dotenv.config({ path: "config/config.env" });

connectDatabase();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});
let users = [];

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
function addUser(userId, socketId) {
  if (!users.some(user => user.userId === userId)) {
    users.push({ userId, socketId });
  }
}

io.on("connection", (socket) => {
  socket.on("userConnected", async (userId) => {
    try {
      addUser(userId, socket.id);
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("SentMessage", async ({ chattingMemberUserId, sentMessage }) => {
    try {
      const targetUser = getUser(chattingMemberUserId);
      if (targetUser) {
        const targetUserSocket = targetUser.socketId;
        io.to(targetUserSocket).emit("receiveMessage", sentMessage)
      }
    } catch (error) {
      console.log(error);
    }
  });



  socket.on("disconnect", () => {
    try {
      console.log("A user disconnected");
      removeUser(socket.id);
    } catch (error) {
      console.log(error);
    }
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});