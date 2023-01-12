const should = require("should");
const sinon = require("sinon");
const userModel = require("./src/user/user.model");
const userController = require("./src/user/user.controller.js");
const {
  UnauthorizedError,
  NotFound,
} = require("./src/errorHandlers/error.handlers");

function sum(a, b) {
  return a + b;
}

/**
 * @describe - test wrap, which can be nested
 Describe has the same life cycle as react/vue components:
 1. before - before test
 2. beforeEach - before each test iteration
 3. afterEach - after each test iteration
 4. after - after all tests
 */

describe("Unit test suitcase example", () => {
  describe("#checkUser", () => {
    let sandbox;
    let findUserByEmailStub;
    let actualResult;
    const email = "email@gmail.com";
    const password = "password";

    /**
     * @before - first stage of test life cycle. 
    Usually is used for test preparation: initialization of test environment, setting variables etc.
    */

    before(async () => {
      /**
        *  Here sinon duplicate function "findUserByEmail" to separate fake environment in sandbox
        * @param {Object} sandbox 
        Sandboxes removes the need to keep track of every fake created, which greatly simplifies cleanup.

        * @param {Function} stub
        Test stubs are functions (spies) with pre-programmed behaviour.
        They support the full test spy API in addition to methods which can be used to alter the stub’s behaviour.
        As spies, stubs can be either anonymous or wrap existing functions. 
        When wrapping an existing function with a stub, the original function is not called.
        */
      sandbox = sinon.createSandbox();
      findUserByEmailStub = sandbox.stub(userModel, "findUserByEmail");

      try {
        await userController.checkUser(email, password);
      } catch (err) {
        actualResult = err;
      }
    });

    /**
     * @after - last stage of test life cycle. 
        Usually is used for cleaning and restoring original environment, like componentDidUnmount

        *  Here sinon restore original environment
        * @param {Function} sandbox.restore
    */

    after(() => {
      sandbox.restore();
    });

    /**
     * @it - test call
     */
    it("should call findUserByEmail", () => {
      /**
       * @Assertion 
        Sinon.JS ships with a set of assertions that mirror most behavior verification methods and properties on spies and stubs. 
        The advantage of using the assertions is that failed expectations on stubs and spies can be expressed directly as assertion failures with detailed and helpful error messages.
        To make sure assertions integrate nicely with your test framework, you should customize either sinon.assert.fail or sinon.assert.failException and look into sinon.assert.expose and sinon.assert.pass.
        The assertions can be used with either spies or stubs.
       */
      sinon.assert.calledOnce(findUserByEmailStub);
      sinon.assert.calledWithExactly(findUserByEmailStub, email);
    });

    it("should throw error", () => {
      // usually lib should looks like normal sentence with dots between words XD
      (actualResult instanceof UnauthorizedError).should.be.true();
    });
  });

  describe("#sum", () => {
    it("should return expected result", () => {
      const result = sum(5, 3);
      should(result).be.eql(8);
    });
  });
});
