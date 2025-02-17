import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import jwt, { Secret } from 'jsonwebtoken';
import { UserPayload } from '../interfaces/User';

const getAccessToken = (req: Request, res: Response) => {
    return res.locals.accessToken = req.signedCookies.accessToken;
};

const getRefreshToken = async (username: string) => {
    return await redisClient.get(username);
};

const verifyAccessToken = (req: Request, res: Response, token: string) => {
    return res.locals.decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserPayload;
};

const verifyRefreshToken = (req: Request, res: Response, token: string) => {
    return res.locals.decodedRefreshToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as Secret) as UserPayload;
};


export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = res.locals.accessToken || getAccessToken(req, res);
        console.log("First access token ", accessToken);
        
        // const accessToken = getAccessToken(req, res);
        if (!accessToken) {
            res.status(401).json({ message: 'Access token is required' });
        }
        // Verify the access token
        const decodedAccessToken = verifyAccessToken(req, res, accessToken);
        console.log("Decoded access token ", decodedAccessToken);
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
        console.log("Second access token", res.locals.accessToken);
        
        const decodedAccessToken = res.locals.decodedAccessToken || verifyAccessToken(req, res, res.locals.accessToken || getAccessToken(req, res));
        // Get refresh token
        const refreshToken = await getRefreshToken(decodedAccessToken.username);
        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh access token is required' });
        }
        console.log("refresh token", refreshToken);
        // Verify the refresh token
        const decodedRefreshToken = verifyRefreshToken(req, res, refreshToken as string);
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
};