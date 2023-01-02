const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // - additional library, which is used for validation ObjectId MongoDB
const userModel = require("./user.model");
const { ObjectId } = require("mongodb");

class UserController {
  async createUser(req, res, next) {
    try {
      const requestBody = JSON.parse(req.body.query);

      const user = await userModel.create(requestBody); // - function for creation an element in Mongodb with validation

      return res.status(201).json(user);
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

  async getUsers(req, res, next) {
    try {
      const users = await userModel.find();

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userModel.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(200).json(user);
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

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const requestBody = JSON.parse(req.body.query);

      const updateResults = await userModel.findUserByIdAndUpdate( // - custom function
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
        user: updateResults,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const user = await userModel.findByIdAndRemove(req.params.id); // - find by id and remove element

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        user: user,
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

  validateFilmForUser(req, res, next) {
    const validateRules = Joi.object({
      name: Joi.string().required(),
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

  async addFilmForUser(req, res, next) {
    try {
      const userId = req.params.id;
      const requestBody = JSON.parse(req.body.query);

      const updateUser = await userModel.findOneAndUpdate(  // find by id and update element
        userId,
        {
          $push: { films: requestBody },
        },
        { new: true } // - give instruction to MongoDB to return already updated document
      );
      return res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  }

  validateRemoveFilmForUser(req, res, next) {
    const validateRules = Joi.object({
      id: Joi.objectId().required(),
    });

    const { query } = req.body;

    const parsedQuery = JSON.parse(query);
    const validationResult = validateRules.validate(parsedQuery);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    next();
  }

  async removeFilmForUser(req, res, next) {
    try {
      const userId = req.params.id;

      const { query } = req.body;

      const parsedQuery = JSON.parse(query);

      const updatedUser = await userModel.findOneAndUpdate(
        id,
        { $pull: { _id: parsedQuery.id } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
