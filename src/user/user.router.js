const { Router } = require("express");

const {
  createUser,
  validateCreateUser,
  getUsers,
  getUserById,
  deleteUserById,
  updateUser,
  validateUpdateUser,
  validateUserID,
  validateFilmForUser,
  addFilmForUser,
  validateRemoveFilmForUser,
  removeFilmForUser,
} = require("./user.controller");

const userRouter = Router();

userRouter.post("/", validateCreateUser, createUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", validateUserID, getUserById);
userRouter.delete("/:id", validateUserID, deleteUserById);
userRouter.put("/:id", validateUpdateUser, validateUserID, updateUser);
userRouter.patch(
  "/:id/films",
  validateUserID,
  validateFilmForUser,
  addFilmForUser
);

userRouter.patch(
  "/:id/films/remove",
  validateUserID,
  validateRemoveFilmForUser,
  removeFilmForUser
);

module.exports = userRouter;
