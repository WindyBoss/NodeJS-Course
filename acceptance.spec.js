const should = require("should");
const request = require("supertest");
const UserServer = require("./src/server");
const userModel = require("./src/user/user.model");

describe("Acceptance tests suitcase example", () => {
  let server;
  const existingEmail = "existingEmail@example.com";

  before(async () => {
    const userServer = new UserServer();
    server = await userServer.start();
  });

  after(() => {
    server.close();
  });

  describe("POST /users", () => {
    /**
     * @it - here needs return error 400
     * This it-test uses request method from "supertest" lib to simulate a POST request
     * Functionality is made by chain functions
     */
    it("should return 400 error", async () => {
      await request(server)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({}) // test if joi will reject the request, because nothing is added to req.body
        .expect(400);
    });
  });

  /**
   * @context - if function needs to connect to external environment
   * @describe - if function doesn't need to connect to external environment
   */
  context("when user with email exists", () => {
    let userDoc;

    /**
     * @before - creates user with email,
     * to check if function will return correct error status
     */
    before(async () => {
      userDoc = await userModel.create({
        username: "test user",
        email: existingEmail,
        password: "test password",
      });
    });

    /**
     * @after - delete created user. It's necessary to clean
     */
    after(async () => {
      await userModel.findByIdAndDelete(userDoc._id);
    });

    /**
     * @it - here needs return error 409
     */
    it("should return 409 error", async () => {
      await request(server)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          username: "test user",
          email: existingEmail,
          password: "test password",
        })
        .expect(409);
    });
  });

  context("when user with email does not exist", () => {
    after(async () => {
      await userModel.deleteMany();
    });

    it("should return 201 success", async () => {
      const response = await request(server)
        .post("/users")
        .set("Content-Type", "application/json")
        .send({
          username: "test userti",
          email: "new_email@gmail.com",
          password: "test password",
        })
        .expect(201);

      const [responseBody] = response.body;

      /**
       * @param {Object} responseBody - object of user
       * Here is checked if responseBody has property id and if it's a String
       * Also check if responseBody doesn't have property password
       */
      responseBody.should.have.property("id").which.is.a.String();
      responseBody.should.not.have.property("password");

      /**
       * Checks if such user was really created
       */
      const createdUser = await userModel.findById(responseBody.id);
      should.exists(createdUser);
    });
  });
});
