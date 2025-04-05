const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let messagesCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected!");
    db = client.db("yap"); // Change if using a different DB name
    messagesCollection = db.collection("messages");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {}; // socket.id -> username

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("set_username", async (username) => {
    users[socket.id] = username;

    // Send recent chat history
    if (messagesCollection) {
      try {
        const history = await messagesCollection
          .find({})
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();

        socket.emit("chat_history", history.reverse());
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }

    io.emit("receive_message", {
      message: `${username} has joined the chat.`,
      sender: "system",
    });
  });

  socket.on("send_message", async (data) => {
    const username = users[socket.id] || "Unknown";
    const messageObj = {
      message: data,
      sender: username,
      createdAt: new Date(),
    };

    try {
      if (messagesCollection) {
        await messagesCollection.insertOne(messageObj);
      }
    } catch (err) {
      console.error("Error saving message to DB:", err);
    }

    io.emit("receive_message", messageObj);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id] || "A user";
    io.emit("receive_message", {
      message: `${username} has left the chat.`,
      sender: "system",
    });

    delete users[socket.id];
  });
});

server.listen(3001, () => {
  console.log("Yap server running on port 3001");
});
