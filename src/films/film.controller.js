const filmModel = require("./films.model");

class FilmController {
  async getAllFilms(req, res, next) {
    const films = await filmModel
      .find()
      .sort({ name: -1 })
      .skip(1) /* skip - start from index in skip */
      .limit(2); // - limit = mongodb pagination
    // -1 - descending
    // 1 ascending


    // db.collection.count - return the length of the list

    return res.status(200).json(films);
  }
}

module.exports = new FilmController();
