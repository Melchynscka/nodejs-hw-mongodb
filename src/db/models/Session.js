import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateOptions } from "../hooks.js";

const sessionsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
}, {
    timestamps: true,
    versionKey: false,
});

sessionsSchema.post("save", handleSaveError);
sessionsSchema.pre("findOneAndUpdate", setUpdateOptions);
sessionsSchema.post("findOneAndUpdate", handleSaveError);

export const SessionsCollection = model('sessions', sessionsSchema);