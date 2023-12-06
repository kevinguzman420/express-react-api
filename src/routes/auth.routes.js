import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  verifyToken,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

// function to validate a schema
import { validateSchema } from "../middlewares/validator.middleware.js";

// schema
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);

router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", logout);

// it's doen't needs to by validated
router.get("/verify", verifyToken);

router.get("/profile", authRequired, profile);

export default router;
