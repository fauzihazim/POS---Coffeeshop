import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import jwt, { Secret } from 'jsonwebtoken';
import { UserPayload } from '../interfaces/User';

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get access token
        const accessToken = req.signedCookies.accessToken;
        if (!accessToken) {
            res.status(401).json({ message: 'Access token is required' });
        }
        // Verify the access token
        const decodedAccessToken = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);
        console.log("Decoded access token ", decodedAccessToken);
        res.locals.accessToken = accessToken;
        res.locals.decodedAccessToken = decodedAccessToken; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Access token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: 'Invalid access token' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedAccessToken = res.locals.decodedAccessToken;
        // Get refresh token
        const refreshToken = await getRefreshToken(decodedAccessToken.username);
        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh access token is required' });
        }
        console.log("refresh token", refreshToken);
        // Verify the refresh token
        const decodedRefreshToken = verifyToken(refreshToken as unknown as string, process.env.REFRESH_TOKEN_SECRET as Secret);
        console.log("Decoded refresh token ", decodedRefreshToken);
        res.locals.refreshToken = refreshToken;
        res.locals.decodedRefreshToken = decodedRefreshToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Refresh token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: 'Invalid refresh token' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as UserPayload;
};

const getRefreshToken = async (username: string) => {
    return await redisClient.get(username);
}