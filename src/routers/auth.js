import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../validation/user.js";
import { registerUserController,loginUserController, logoutUserController, refreshUserSessionController  } from '../controllers/auth.js';
import { requestResetEmailSchema } from '../validation/user.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/user.js';
import { resetPasswordController } from '../controllers/auth.js';


const authRouter = Router();

    authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
    authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));
    authRouter.post('/logout', ctrlWrapper(logoutUserController));
    authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
    authRouter.post('/request-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController),
    authRouter.post('/reset-password', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController)
)
);

export default authRouter;