import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateOptions } from "../hooks.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },

}, { versionKey: false, timestamps: true });

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateOptions);
userSchema.post("findOneAndUpdate", handleSaveError);

export const UserCollection = model("user", userSchema);
