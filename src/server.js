const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");
const jwt = require("jsonwebtoken");

/**
 * mongoose - library, which is used to connect to MongoDB
 */
const mongoose = require("mongoose");
require("dotenv").config();
const { PORT, MONGO_URL, DB_NAME, COLLECTION_NAME } = process.env;

const userRouter = require("./user/user.router");
const filmRouter = require("./films/films.router");
const authRouter = require("./auth/auth.router");

module.exports = class UserServer {
  constructor() {
    this.server = null;

    // saved in constructor the socket variables
    this.httpServer = null;
    this.io = null;
    this.socketsByIds = {};
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    // should be added web-socket handler
    this.initWsHandlers();
    await this.initDatabase();
    return this.startListening();
  }

  initServer() {
    this.server = express();
    // websocket connection is initialized in the next way
    this.httpServer = http.createServer(this.server);
    this.io = socketIO(this.httpServer);
  }

  initMiddlewares() {
    this.server.use(express.urlencoded());
    this.server.use(express.json());
    // HTML is taken from static
    this.server.use(express.static(path.join(__dirname, "static")));
  }

  initRoutes() {
    this.server.use("/users", userRouter);
    this.server.use("/films", filmRouter);
    this.server.use("/auth", authRouter);
  }

  async initDatabase() {
    await mongoose.connect(MONGO_URL);
  }

  initWsHandlers() {
    this.io.on("connect", (socket) => {
      console.log("connection received");

      socket.on("join", (token) => {
        // on join operation check verification token and return user id.
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        this.socketsByIds[id] = socket;
      });
      /**
       * If will be open 3 tabs - message will be seen in all 3 tabs
       */
      socket.on("chat message", (data) => {
        console.log(data);
        // Send message to specific user based on id received from token verification
        if (data.to) {
          const socketRecepient = this.socketsByIds[data.to];
          if (!socketRecepient) {
            socket.emit("error", {
              message: "user does not  exist or does not connected to server",
            });
          }
          socketRecepient.emit("chat message", data.message);
        }
        this.io.emit("chat message", data);
      });
    });
  }

  startListening() {
    // return this.server.listen(PORT, () => {
    //   console.log(`Server listening on port ${PORT}`);
    // });

    // server must be replaced by httpServer
    return this.httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};
