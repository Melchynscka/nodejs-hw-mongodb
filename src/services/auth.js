import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from "http-errors";
import { UserCollection } from "../db/models/User.js";
import { SessionsCollection } from '../db/models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';


export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email already used');
  
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); 

  if (!isEqual) {
    throw createHttpError(401, 'Login or password incorrect');
  }
    await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
  
};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};
const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};
export const refreshUsersSession = async ({ sessionId, refreshToken, }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (!session)
        throw createHttpError(401, 'Session not found');
    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }
  const newSession = createSession();
  
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  
    return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};