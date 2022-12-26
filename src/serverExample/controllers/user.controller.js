import Joi from "joi";

const users = [
  { id: 1, name: "John Doe", email: "jdoe@example.com", password: "password" },
];

class UserController {
  get createUser() {
    return this._createUser.bind(this);
  }

  get updateUser() {
    return this._updateUser.bind(this);
  }

  get deleteUser() {
    return this._deleteUser.bind(this);
  }

  getUsers() {
    return users;
  }

  async _createUser(req, res, next) {
    const newUser = {
      ...req.body.variables,
      id: users.length + 1,
    };

    users.push(newUser);

    return res
      .status(201)
      .json({
        message: "User created",
        users: users,
      })
      .send();
  }

  validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    console.log(req.body);
    const result = createUserRules.validate(req.body.variables);

    if (result?.error) {
      return res
        .status(400)
        .json({
          error: result.error.details[0].message,
        })
        .send();
    }

    next();
  }

  async _updateUser(req, res, next) {
    try {
      const targetUserIndex = userController.findUserById(req.query.id, res);

      users[targetUserIndex] = {
        ...users[targetUserIndex],
        ...req.body.variables,
      };
      return res.status(200).json({ users: users }).send();
    } catch (error) {
      next(error);
    }
  }

  validateUpdateUser(req, res, next) {
    const updateUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
    });

    const result = updateUserRules.validate(req.body.variables);

    if (result?.error) {
      return res
        .status(400)
        .json({
          error: result.error.details[0].message,
        })
        .send();
    }

    next();
  }

  async _deleteUser(req, res, next) {
    try {
      const targetUserIndex = userController.findUserById(req.query.id, res);

      if (targetUserIndex) {
        return;
      }

      users.splice(targetUserIndex, 1);
      return res.status(200).json({ users: users }).send();
    } catch (error) {
      next(error);
    }
  }

  findUserById(userId, res) {
    const id = parseInt(userId);

    const targetUserIndex = users.findIndex((user) => user.id === id);

    if (targetUserIndex === -1) {
      throw new NotFoundError("User is not founded");
    }

    return targetUserIndex;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.status = 404;
    delete this.stack;
  }
}

const userController = new UserController();

export default userController;
