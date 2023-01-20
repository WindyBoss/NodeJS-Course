const { Router } = require("express");

const {
  getUsers,
  getUserById,
  deleteUserById,
  updateUser,
  validateUpdateUser,
  validateUserID,
  addFilmForUser,
  removeFilmForUser,
  getCurrentUser,
} = require("./user.controller");

const { authorize } = require("../auth/auth.controller");

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/current", authorize, getCurrentUser);
userRouter.get("/:id", validateUserID, getUserById);
userRouter.delete("/:id", validateUserID, deleteUserById);
userRouter.put("/:id", validateUpdateUser, validateUserID, updateUser);
userRouter.patch("/films/favourite/:id", authorize, addFilmForUser);
userRouter.delete("/films/favourite/:id", authorize, removeFilmForUser);

module.exports = userRouter;
