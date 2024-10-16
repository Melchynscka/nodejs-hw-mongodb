import Joi from "joi";
import { contactType } from "../constants/contact.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().min(3).max(20),
    phoneNumber: Joi.string().required().min(3).max(20).messages({
        "any.required": "number must be exist",
    }),
    contactType: Joi.string().required().valid(...contactType).default('personal').min(3).max(20),
    isFavourite: Joi.boolean(),
    email: Joi.string(),
    
});

export const contactPatchSchema = Joi.object({
    name: Joi.string().min(3).max(20),
	phoneNumber: Joi.string().min(3).max(20),
	isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactType).default('personal').min(3).max(20),
    email: Joi.string()
});