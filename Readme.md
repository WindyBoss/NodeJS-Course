# Code testing
*Code testing* - automatic testing of written code by adding additional code in separate files (files must have .test.js or .spec.js)

**There are 4 levels of code testing:**
1. Unit tests - the lowest level of code testing - isolated test of function, component or method - 80% of all test on project
2. Integration tests - test of cooperation of systems e.g. endpoint fetch
3. system tests - test of system (e.g. frontend and backend separately)
4. end-to-end tests - test of whole application 


## Unit Test Instruments
1. test runner - framework, which initializes the test environment - [Mocha](https://mochajs.org/), [Jasmine](https://jasmine.github.io/), [Jest](https://jestjs.io/)
2. Assertion Library - Lib, which checks in function call brings the same results as was expected - [Chai](https://www.chaijs.com/), [Should.js](https://shouldjs.github.io/), [Must.js](https://www.npmjs.com/package/must)
3. Mocking library - Lib, which helps the replace the behaviour of functions, which cooperate with other systems for test moment - [sinon.js](https://sinonjs.org/)

Example: my-first-unit-test.spec.js
Remarks: It is good to create separate function (copy of tested function)

## Integration tests
[supertest](https://www.npmjs.com/package/supertest)

Example: acceptance.spec.js
Remarks: It is necessary to return server.listen function from class


## Coverage
**Coverage** - the level of covering the code by tests. If all functions, feature and components are covered by test, coverage = 100%

It is possible to get coverage report from Jest lib by adding the next code to package.json
```Json
"jest": {
     "collectCoverage": true,
     "coverageReporters": ["json", "html"],
 }
```
or create file jest.config.js with test configurations