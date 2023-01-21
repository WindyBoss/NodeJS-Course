const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const userModel = require("../user/user.model");
const bcryptjs = require("bcryptjs");
const { v4 } = require("uuid");
const sgMail = require("@sendgrid/mail");

const { UnauthorizedError } = require("../errorHandlers/error.handlers");
const jwt = require("jsonwebtoken");

class AuthController {
  constructor() {
    this._costFactor = 4;
    this._sgMail = sgMail;

    this._sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  get signIn() {
    return this._signIn.bind(this);
  }

  get signUp() {
    return this._signUp.bind(this);
  }

  async _signUp(req, res, next) {
    try {
      const requestBody = req.body;

      const { password, username, email } = requestBody;
      const hashedPassword = await bcryptjs.hash(password, this._costFactor);

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        return res.status(409).send("User with such email already exists");
      }

      const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });

      const verificationToken = v4();

      await userModel.createVerificationToken(user._id, verificationToken);

      /**
       * For verification is necessary to send a verification link to user.
       * Also to create a router endpoint, which serve mail verification
       */
      const msg = {
        to: user.email,
        from: process.env.Send_Mail,
        subject: "email verification",
        html: `<a href='http://localhost:3000/auth/verify/${verificationToken}'>To verify your email click here</a>`,
      };

      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
      }

      return res.status(201).json(this.prepareReturnUserData([user]));
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;

      const userToVerify = await userModel.findVerificationToken(token);

      if (!userToVerify) {
        throw new NotFoundError("user not found");
      }

      await userModel.verifyUser(userToVerify._id);

      return res.status(200).send("You are successfully verified");
    } catch (error) {
      next(error);
    }
  }

  validateSignUp(req, res, next) {
    const validateRules = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
    });

    const requestBody = req.body;
    const validationResult = validateRules.validate(requestBody);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    next();
  }

  async _signIn(req, res, next) {
    try {
      const { email, password } = JSON.parse(req.body.query);
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(401).send("Authentication failed");
      }

      const isPasswordsValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordsValid) {
        return res.status(401).send("Authentication failed");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 2,
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

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      let userId = null;
      try {
        userId = jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (error) {
        next(new UnauthorizedError("User is not authorized"));
      }

      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError("User is not authorized");
      }
      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
