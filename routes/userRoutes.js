import express from "express";
import {
  authenticateUser,
  createUser,
  confirmToken,
  recoverPassword,
  validateToken,
  newPassword,
  profile,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//Authentication, registry and confirmation of users
router.post("/", createUser);
router.post("/login", authenticateUser);
router.get("/confirm/:token", confirmToken);
router.post("/forgot-password", recoverPassword);
router.route("/forgot-password/:token").get(validateToken).post(newPassword);

//Middleware that check token valid and expiration date, etc..
router.get("/profile", checkAuth, profile);

export default router;
