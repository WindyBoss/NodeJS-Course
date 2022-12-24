/**
*   Dotenv
    Dotenv - library, which helps to increase the usability of node.process 
    by adding some hidden variable in .env file
 */

import dotenv from "dotenv";
dotenv.config();

/**
*   Express 
    Express - library, which help to create server

    Express can use middlewares, which can serve some endpoints or global server.
    For example: express.json()
*/
import express from "express";

/** 
*   Node-fetch
    node-fetch - library, which allows to use fetch functionality in node.js
*/
import fetch from "node-fetch";

/**
*   CORS
    cors - library, which allows to implement cors policy and is used as middleware
 */

import cors from "cors";

import Joi from "joi";

import getWeatherData from "./apiService/weatherApi.js";

/* <=============================Express=initialization==============================================> */

const app = express(); // - initialize server app
const PORT = process.env.PORT; // - take variable from .env
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// app.use(cors());

/* <=============================Middleware==========================================================> */
app.use(express.json()); // - middleware, that allows express to serve all json

/* <=============================Adding=CORS=by=Library==============================================> */

app.use(cors({ origin: "http://localhost:3000" }));

/* <=============================Adding=CORS=Manually================================================> */
// app.use(addAllowOriginHeader);
// app.options("*", addCorsHeaders);

/* <=============================Servicing=of=Endpoints===============================================> */

/**
 * helps to serve GET method in endpoint '.../weather'
 
 * Middlewares: 
 * @validateWeatherQueryParams - request body validation
 * @getWeatherNodeFetch - data fetch and return response
 */
app.get("/weather", validateWeatherQueryParams, getWeatherNodeFetch); // -

/* <=============================Endpoint's=functions================================================> */

/**
 * @getWeatherNodeFetch - middleware
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {Function} next - function (sent to next middleware)
 * @returns @param {Object} response - based on middleware (usually some status and @param {Object} responseBody)
 
 * It is better to use fetch in node.js instead of axios
 */
async function getWeatherNodeFetch(req, res, next) {
  const { lat, lon } = req.query;
  const link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(link);
  const responseBody = await response.json();

  if (responseBody.cod >= 400) {
    return res.status(400).send(responseBody.message);
  }

  return res.status(200).send(responseBody);
}

function validateWeatherQueryParams(req, res, next) {
  const weatherRules = Joi.object({
    lat: Joi.string().required(),
    lon: Joi.string().required(),
  });

  const validationResult = weatherRules.validate(req.query);

  if (validationResult?.error) {
    return res.status(400).send(validationResult?.error);
  }

  next();
}

/* <=============================Custom=Cors=Policy=without=CORS=library============================> */

function addAllowOriginHeader(req, res, next) {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  next();
}

function addCorsHeaders(req, res, next) {
  res.set(
    "Access-Control-Allow-Methods",
    req.headers["access-control-request-method"]
  );

  res.set(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
  );

  res.status(200).send();

  next();
}

/* <=============================Server=Listening===================================================> */

app.listen(PORT, () => {
  console.log("Started listening on port", PORT);
});

/* <=================================================================================================> */

/*
 * It is better to use fetch in node.js instead of axios
 */
async function getWeatherAXIOS(req, res, next) {
  const { lat, lon } = req.query;

  try {
    const response = await getWeatherData({
      apiKey: API_KEY,
      lat: lat,
      lon: lon,
    });

    return res.send(response.data);
  } catch (error) {
    const errorMessage = await (await fetch(error.config.url)).json();
    return res.status(400).send(errorMessage);
  }
}
