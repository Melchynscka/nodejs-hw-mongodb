import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema, loginWithGoogleOAuthSchema  } from "../validation/user.js";
import { registerUserController,loginUserController, logoutUserController, refreshUserSessionController, requestResetEmailController, resetPasswordController, loginWithGoogleController  } from '../controllers/auth.js';
import { getGoogleOAuthUrlController } from "../controllers/auth.js"


const authRouter = Router();

    authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
    authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));
    authRouter.post('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
    authRouter.post('/logout', ctrlWrapper(logoutUserController));
    authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
    authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController)),
    authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController))
    authRouter.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController),);

export default authRouter;