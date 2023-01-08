const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const userModel = require("./user.model");
const bcryptjs = require("bcryptjs");
const filmModel = require("../films/films.model");
// const { ObjectId } = require("mongodb");
const {
  Types: { ObjectId },
} = require("mongoose");

const {
  UnauthorizedError,
  NotFound,
} = require("../errorHandlers/error.handlers");

const jwt = require("jsonwebtoken");

class UserController {
  constructor() {
    this._costFactor = 4; // - present how many times the password will be hashed (or level of protection: more protected = more machine calculation is necessary)
  }

  /**
   * @readonly
   * @memberof UserController
   * @Getters is necessary to connect functions to context, because function does not see this._costFactor
   */
  get createUser() {
    return this._createUser.bind(this);
  }

  get signIn() {
    return this._signIn.bind(this);
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

  /**
   * @_createUser & @validateCreateUser - functions for user creation
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object || String} based on conditions
   */

  async _createUser(req, res, next) {
    try {
      const requestBody = JSON.parse(req.body.query);

      const { password, username, email } = requestBody;
      const hashedPassword = await bcryptjs.hash(password, this._costFactor);

      /**
       * hash password example: $sdSDFDFAfghdfgSDFhGFGdvsHASfdHo43456L9CT3534q/g.r9K3426ZxSDA45608JVIsSDFuiaFDSGsdfaHFGsFGojcHGFxzlP26Jnfh6d5fsdf643v1fPQKLi
                                                                                ||
                                                      Here is splitted between real hashed password and hashed salt
      */

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        return res.status(409).send("User with such email already exists");
      }

      const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json(this.prepareReturnUserData([user]));
    } catch (error) {
      next(error);
    }
  }

  validateCreateUser(req, res, next) {
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

  /**
   * @_signIn & @validateSignIn - functions for user authorization
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object || String} based on conditions
   */
  async _signIn(req, res, next) {
    try {
      const { email, password } = JSON.parse(req.body.query);
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(401).send("Authentication failed");
      }

      const isPasswordsValid = await bcryptjs.compare(password, user.password); // bcrypt validation
      if (!isPasswordsValid) {
        return res.status(401).send("Authentication failed");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 2, // - in seconds shows how much time token is valid (here 2 days)
      });
      await userModel.updateToken(user._id, token);

      return res.status(200).json({
        message: "Authentication successful",
        user: this.prepareReturnUserData([user]),
      });
    } catch (error) {
      next(error);
    }
  }

  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const userData = JSON.parse(req.body.query);
    const validationResult = signInRules.validate(userData);

    if (!validationResult) {
      return res.status(400).send(validationResult.error.details[0].message);
    }

    next();
  }

  /**
   * @getUsers & @getUserById - user getters
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object || String} based on conditions
   */
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

  /**
   * @updateUser & @validateUpdateUser - update user
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object || String} based on conditions
   */

  async _updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const requestBody = JSON.parse(req.body.query);

      const updateResults = await userModel.findUserByIdAndUpdate(
        // - custom function
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

  /**
   * @deleteUserById - delete user
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object || String} based on conditions
   */
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

  /**
   * @addFilmForUser & @removeFilmForUser - user field management
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {Object || String} based on conditions
   */

  async _addFilmForUser(req, res, next) {
    try {
      const filmId = req.params.id;
      const film = await filmModel.findById(filmId);

      if (!film) {
        throw new NotFound("Film does not exists");
      }

      await userModel.findOneAndUpdate(
        req.user._id,
        {
          $push: { favouriteFilmIds: filmId }, // - push - operation similar to Array.push
        },
        { new: true }
      );

      const userWithFilms = await userModel.aggregate([
        // - function responsible for complex data search
        { $match: { _id: req.user._id } }, // - operation, which is similar to Array.find
        {
          $lookup: {
            // - similar to vlookup in excel, but is used to combine two collections
            from: "films",
            localField: "favouriteFilmIds",
            foreignField: "_id",
            as: "films",
          },
        },
      ]);

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
      const updatedUser = await userModel
        .findOneAndUpdate(
          req.user._id,
          {
            $pull: { favouriteFilmIds: filmId },
          },
          { new: true }
        )
        .populate("favouriteFilmIds"); // - similar to aggregate ($lookup), but less flexible and makes for 1 fetch more

      return res.status(200).json(this.prepareReturnUserData([updatedUser]));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @prepareReturnUserData prepare user return
   * @param {Array} users
   * @returns {Array}
   */

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

  /**
   * @authorize
   * Authorization middleware
   * Check the rights, when user try to do some operations
   Main tasks:
   1. take token from header: Authorization or cookies
   2. if no token or invalid token returns 401
   3. if token has no right for operation returns 403
   4. if everything is good add token to request object and make next
   */

  async authorize(req, res, next) {
    try {
      // 1. Get token from header: Authorization or cookies
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", ""); // standard is to add "Bearer " to each token

      // 2. Get user id from token payload or return error 401
      let userId = null;
      try {
        userId = jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (error) {
        next(new UnauthorizedError("User is not authorized"));
      }

      // 3. Get user from userModel. If error return 401
      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError("User is not authorized");
      }
      // 4. if everything is good add token to request object and make next
      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @logout
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async _getCurrentUser(req, res, next) {
    const [userForResponse] = this.prepareReturnUserData([req.user]);

    return res.status(200).json(userForResponse);
  }
}

module.exports = new UserController();
