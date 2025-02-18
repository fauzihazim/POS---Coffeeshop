import jwt, { Secret } from 'jsonwebtoken';
import { UserPayload } from '../interfaces/User';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;

export const generateAccessToken = (user: object) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1s' });
};

export const generateRefreshToken = (user: object) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string, secret: Secret): UserPayload => {
    return jwt.verify(token, secret) as UserPayload;
};