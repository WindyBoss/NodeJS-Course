import express from "express";
import userController from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
  const users = userController.getUsers();
  res.send(users);
});

userRouter.post(
  "/",
  userController.validateCreateUser,
  userController.createUser
);

userRouter.put(
  "/",
  userController.validateUpdateUser,
  userController.updateUser
);

userRouter.delete("/", userController.deleteUser);

export default userRouter;
