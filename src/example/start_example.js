const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const Joi = require("joi");

const PORT = 3000;
const MONGO_URL =
  "mongodb+srv://vitititi:Vo4okidik123@mongodb-test.586p9pl.mongodb.net/test_db?retryWrites=true&w=majority";
const DB_NAME = "test_db";
const COLLECTION_NAME = "collection_db";

let db, collection;

async function main() {
  const server = express();
  server.use(express.json());

  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);

  server.post("/users", validateCreateUser, createUser);
  server.get("/users", getUsers);
  server.get("/users/:id", validateUserId, getUserById);
  server.delete("/users/:id", validateUserId, deleteUserById);
  server.put("/users/:id", validateUpdateUser, validateUserId, updateUser);

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

function validateCreateUser(req, res, next) {
  const validateRules = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
  });

  const requestBody = JSON.parse(req.body.query);

  const validationResult = validateRules.validate(requestBody);

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.details[0].message,
    });
  }

  next();
}

async function createUser(req, res, next) {
  try {
    const requestBody = JSON.parse(req.body.query);
    await collection.insertOne(requestBody);

    return res.status(201).json({
      message: "User created successfully",
      user: requestBody,
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await collection.find().toArray();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
}

function validateUserId(req, res, next) {
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: "Invalid user id",
    });
  }

  next();
}

async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;

    const user = await collection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUserById(req, res, next) {
  try {
    const userId = req.params.id;

    const user = await collection.findOneAndDelete({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user: user.value,
    });
  } catch (error) {
    next(error);
  }
}

function validateUpdateUser(req, res, next) {
  const requestBody = JSON.parse(req.body.query);

  const validateRules = Joi.object({
    username: Joi.string(),
    password: Joi.string(),
    email: Joi.string(),
  });

  const validationResult = validateRules.validate(requestBody);

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.details[0].message,
    });
  }

  next();
}

async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const requestBody = JSON.parse(req.body.query);

    const updateResults = await collection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: requestBody,
      }
    );

    if (!updateResults.modifiedCount) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(204).json({
      message: "User updated successfully",
      user: updateResults,
    });
  } catch (error) {
    next(error);
  }
}

main();
