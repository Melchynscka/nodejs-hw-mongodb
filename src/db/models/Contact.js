import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: String,
    isFavourite: {
        type: Boolean,
        required: true,
        default: false
    },
    contactType: {
        type: String,
        enum: ["work", "home", "personal"],
        required: true,
    },
    createdAt:{
        type: String,
        required: true,
    },
    updatedAt:{
        type: String,
        required: true,
    }

}, { versionKey: false, timestamps: true });

export const ContactCollection = model("contact", contactSchema);
