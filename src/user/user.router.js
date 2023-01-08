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
  addFilmForUser,
  removeFilmForUser,
  validateSignIn,
  signIn,
  authorize,
  logout,
  getCurrentUser,
} = require("./user.controller");

const userRouter = Router();

userRouter.post("/", validateCreateUser, createUser);
userRouter.get("/", getUsers);
userRouter.get("/current", authorize, getCurrentUser);
userRouter.get("/:id", validateUserID, getUserById);
userRouter.delete("/:id", validateUserID, deleteUserById);
userRouter.put("/sign-in", validateSignIn, signIn); // this route should be higher than route below (higher router has priority)
userRouter.put("/:id", validateUpdateUser, validateUserID, updateUser);

userRouter.patch("/films/favourite/:id", authorize, addFilmForUser);

userRouter.patch("/logout", authorize, logout);

userRouter.delete("/films/favourite/:id", authorize, removeFilmForUser);

module.exports = userRouter;
