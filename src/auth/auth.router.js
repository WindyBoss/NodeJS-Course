const { Router } = require("express");

const {
  signUp,
  validateSignUp,
  validateSignIn,
  signIn,
  authorize,
  logout,
  verifyEmail,
} = require("./auth.controller");

const authRouter = Router();

authRouter.post("/sign-up", validateSignUp, signUp);
authRouter.put("/sign-in", validateSignIn, signIn);

authRouter.patch("/logout", authorize, logout);

authRouter.get("/verify/:token", verifyEmail);

module.exports = authRouter;
