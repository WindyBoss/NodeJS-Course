/** @format */

const express = require("express");


/*
* express - nodejs framework for server management, which helps to create server and serve clients requests in easier way than without it
*/

const app = express();

// * middlewares, that help to serve requests. for example parse json or url, send static files
app.use(express.json()); // parse json
app.use(express.urlencoded()); // url encoded
app.use(express.static('public')) // take static file from folder public according to current folder

app.get(
  "",
  (req, res, next) => {
    res.set("Set-Cookie", "new cookie");

    const err = new Error();
    err.status = 400;

    next(err); // help to send request to next middleware, if inside semicolons is an attribute => throw Error
    // After line above code stops and throw error
    // next();
  },
  (req, res, next) => {
    return res.send({ hello: "hello" });
  }
);

app.post('', (req, res) => {
  console.log(req.body);
  return res.send({ hello: req.body }); // return objet {hello: request body}
})

app.listen(3000, () => {
  console.log("started on port 3000");
});
