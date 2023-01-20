const express = require("express");

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
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    // needs to be returned for test
    return this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/users", userRouter);
    this.server.use("/films", filmRouter);
    this.server.use("/auth", authRouter);
  }

  async initDatabase() {
    await mongoose.connect(MONGO_URL);
  }

  // needs to be returned for test
  startListening() {
    return this.server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};
