const { Router } = require("express");
const { getAllFilms } = require("./film.controller");

const filmRouter = Router();
filmRouter.get("/", getAllFilms);

module.exports = filmRouter;
