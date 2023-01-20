const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const userModel = require("./user.model");
const filmModel = require("../films/films.model");

const {
  Types: { ObjectId },
} = require("mongoose");

const { NotFound } = require("../errorHandlers/error.handlers");

class UserController {
  constructor() {
    this._costFactor = 4;
  }

  get getUsers() {
    return this._getUsers.bind(this);
  }

  get getUserById() {
    return this._getUserById.bind(this);
  }

  get updateUser() {
    return this._updateUser.bind(this);
  }

  get deleteUserById() {
    return this._deleteUserById.bind(this);
  }

  get addFilmForUser() {
    return this._addFilmForUser.bind(this);
  }

  get removeFilmForUser() {
    return this._removeFilmForUser.bind(this);
  }

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  async _getUsers(req, res, next) {
    try {
      const users = await userModel.find();

      console.log(users);

      return res.status(200).json(this.prepareReturnUserData([...users]));
    } catch (error) {
      next(error);
    }
  }

  async _getUserById(req, res, next) {
    try {
      const user = await userModel.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(200).json(this.prepareReturnUserData([user]));
    } catch (error) {
      next(error);
    }
  }

  async _updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const requestBody = JSON.parse(req.body.query);

      const updateResults = await userModel.findUserByIdAndUpdate(
        userId,
        requestBody
      );

      if (!updateResults) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(204).json({
        message: "User updated successfully",
        user: this.prepareReturnUserData([updateResults]),
      });
    } catch (error) {
      next(error);
    }
  }

  validateUpdateUser(req, res, next) {
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

  async _deleteUserById(req, res, next) {
    try {
      const user = await userModel.findByIdAndRemove(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        user: this.prepareReturnUserData([user]),
      });
    } catch (error) {
      next(error);
    }
  }

  validateUserID(req, res, next) {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    next();
  }

  async _addFilmForUser(req, res, next) {
    try {
      const filmId = req.params.id;
      const film = await filmModel.findById(filmId);

      if (!film) {
        throw new NotFound("Film does not exists");
      }

      const userWithFilms = await userModel.addFilmForUser(
        req.user._id,
        filmId
      );

      return res.status(200).json({
        userData: this.prepareReturnUserData(userWithFilms),
      });
    } catch (error) {
      next(error);
    }
  }

  async _removeFilmForUser(req, res, next) {
    try {
      const filmId = req.params.id;
      const film = await filmModel.findById(filmId);

      if (!film) {
        throw new NotFound("Film does not exists");
      }
      const updatedUser = await userModel.removeFilmForUser(
        req.user._id,
        filmId
      );

      return res.status(200).json(this.prepareReturnUserData([updatedUser]));
    } catch (error) {
      next(error);
    }
  }

  prepareReturnUserData(users = []) {
    const newUserListData = users.map((user) => {
      const { _id, username, email, favouriteFilmIds, films } = user;
      return {
        id: _id,
        username: username,
        email: email,
        films: films ? films : favouriteFilmIds,
      };
    });
    return newUserListData;
  }

  async _getCurrentUser(req, res, next) {
    const [userForResponse] = this.prepareReturnUserData([req.user]);

    return res.status(200).json(userForResponse);
  }
}

module.exports = new UserController();
