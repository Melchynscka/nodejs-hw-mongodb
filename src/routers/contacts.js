import { Router } from "express";
import { getAllContactsController, getContactByIdController, addContactController, patchContactController, upsertContactController, deleteContactController} from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactPatchSchema } from "../validation/contacts.js";
import isValidId from "../middlewares/isValid.js";


const contactsRouter = Router();

contactsRouter.get("/",ctrlWrapper(getAllContactsController));
contactsRouter.get("/:contactId",isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post("/",validateBody(contactAddSchema), ctrlWrapper(addContactController));
contactsRouter.put("/:contactId",isValidId,validateBody(contactAddSchema), ctrlWrapper(upsertContactController));
contactsRouter.patch("/:contactId",isValidId, validateBody(contactPatchSchema), ctrlWrapper(patchContactController));
contactsRouter.delete("/:contactId",isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;