import { Router } from "express";
import { getAllContactsController, getContactByIdController, addContactController, patchContactController, upsertContactController, deleteContactController} from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactPatchSchema } from "../validation/contacts.js";
import isValidId from "../middlewares/isValid.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getAllContactsController));
contactsRouter.post('/register', validateBody(contactAddSchema), ctrlWrapper(addContactController)),
contactsRouter.get("/:contactId",isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post("/", upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(addContactController));
contactsRouter.put("/:contactId", isValidId,validateBody(contactAddSchema), ctrlWrapper(upsertContactController));
contactsRouter.patch("/:contactId", isValidId, validateBody(contactPatchSchema), ctrlWrapper(patchContactController));
contactsRouter.delete("/:contactId", isValidId, upload.single('photo'), ctrlWrapper(deleteContactController));


export default contactsRouter;