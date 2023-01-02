const express = require("express");

/**
 * mongoose -
 */
const mongoose = require("mongoose");
require("dotenv").config();
const { PORT, MONGO_URL, DB_NAME, COLLECTION_NAME } = process.env || 3000;

const userRouter = require("./user/user.router");

module.exports = class UserServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/users", userRouter);
  }

  async initDatabase() {
    await mongoose.connect(MONGO_URL);
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};
