const { MongoClient } = require("mongodb");

const MONGO_URL =
  "mongodb+srv://vitititi:Vo4okidik123@mongodb-test.586p9pl.mongodb.net/test_db?retryWrites=true&w=majority";
const DB_NAME = "test_db";
const COLLECTION_NAME = "collection_db";

const client = new MongoClient(MONGO_URL);

async function main() {
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  await collection.insertMany([
    // - is used to insert multiple documents
    { username: "piseczki", password: "123456", email: "test@piseczki.com" },

    { username: "vitititi", password: "123456", email: "test@vititi.com" },
    { username: "sisunki", password: "sisunki", email: "test@sisunki.com" },
  ]);

  console.log(
    await collection
      .find({ $or: [{ username: "vitititi" }, { username: "piseczki" }] }) // - is used to filter element in collection
      .toArray()
  );
}

main();
