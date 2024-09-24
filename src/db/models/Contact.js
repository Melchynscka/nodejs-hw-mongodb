import { Schema, model } from "mongoose";
import { contactType } from "../../constants/contact.js";
import { handleSaveError, setUpdateOptions } from "../hooks.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    // email: String,
    isFavourite: {
        type: Boolean,
        required: true,
        default: false
    },
    contactType: {
        type: String,
        enum: contactType,
        required: true,
    }
    // createdAt:{
    //     type: String,
    //     required: true,
    // },
    // updatedAt:{
    //     type: String,
    //     required: true,
    // }

}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateOptions);
contactSchema.post("findOneAndUpdate", handleSaveError);

const ContactCollection = model("contact", contactSchema);
export const sortFields = ["name", "phoneNumber","isFavourite", "contactType"]
export default ContactCollection;