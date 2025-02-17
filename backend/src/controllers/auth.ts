import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/User';
import { DecodedToken } from '../interfaces/Decode';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwtUtils';
import { redisClient } from '../config/redis';

import { pool } from '../config/db';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;

export const login = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } = req.body;
    try {
        const [results] = await pool.query("SELECT username, password, email, role FROM user WHERE username = ?", [username]);
        // Type assertion for results
        const result = results as User[];
        const user = result[0];
        if (user.username && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken({ username: user.username, email: user.email, role: user.role });
            // set cookies access and refresh token
            res.cookie('accessToken', accessToken, { signed: true, maxAge: 1200000, httpOnly: true, domain: "localhost", secure: true });
            const refreshToken = generateRefreshToken({ username: user.username, email: user.email, role: user.role });
            await redisClient.set(user.username, refreshToken, {
                EX: 24 * 60 * 60, // Set expiration time to 24 hours
            });
            // console.log("Header", req.headers.authorization);
            
            res.status(200).json({ status: "success", message: "Login successfully", data: { accessToken, refreshToken } });
        } else {
            res.status(401).json({ status: "failed", message: "Invalid credential" });
        }
    } catch (err) {
        res.status(500).json({ status: "failed", message: "Login error" });
    }
}

export const getCookie = async (req: Request, res: Response) => {
    const cookies = await getSpesificCookies(req, res);
    res.status(200).json({ status: "success", message: "Get cookies successfully", data: { cookies } });
};

const getSpesificCookies = async (req: Request, res: Response) => {
    const cookies = req.signedCookies;
    if (cookies) {
        const accessToken = req.signedCookies.accessToken;
        console.log("The access token ", accessToken);
        
        return accessToken;
    } else {
        res.status(404).send({ status: "failed", error: 'Cookie not found' });
        return;
    }
};

const tokenDecoder = (token: string) => {
    const arrayToken = token.split('.');
    console.log("Array Token: ", arrayToken);
    const decoder = JSON.parse(atob(arrayToken[1]));
    console.log("The decoder ", decoder);
    return decoder;
};

export const refreshToken = async (req: Request, res: Response) => {
    // const accessToken = req.signedCookies.accessToken;
    const accessToken = res.locals.accessToken;
    console.log("The accessToken from res", accessToken);
    
    // const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as DecodedToken;
    // const decodedToken = tokenDecoder(accessToken, ACCESS_TOKEN_SECRET);
    // console.log('Decoded Token is: ', decodedToken);
    
    // const username = decodedToken.username;
    // const refreshToken: string | null = await redisClient.get(username);

    // if (!refreshToken) {
    //     res.status(401).json({ status: "failed", message: 'Refresh token is required' });
    //     return;
    // };
    const refreshToken = res.locals.refreshToken;
    const decodedToken = res.locals.decodedAccessToken;
    console.log("THe decoded 1 : ", decodedToken);
    try {
        console.log("THe decoded 2 : ", decodedToken);
        // if (verifyToken(refreshToken, REFRESH_TOKEN_SECRET)) {
        //     res.status(403).json({ status: "failed", message: "Failed bro" })
        // };
        
        // verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken({ username: decodedToken.username, email: decodedToken.email, role: decodedToken.role });
        res.status(200).json({ status: "success", message: "Token refreshed", data: { accessToken } });
    } catch (error) {
        res.status(403).json({ status: "failed", message: 'Invalid or expired refresh token' });
    }
};

export const clearCookie = (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.status(200).json({ status: "success", message: "Cookie cleared" });
}

const addTokenBlacklist = async (token: string | unknown, secret: Secret, tokenType: "AccessToken" | "RefreshToken") => {
    console.log(`Token: ${token}, token type: ${tokenType}`);
    const decodedToken = tokenDecoder(token as string);
    let expiry = decodedToken.exp as number - Math.floor(Date.now() / 1000);
    console.log("Expired before: ", expiry);
    if (expiry <= 0) {
        expiry = 1; 
    }
    console.log("Expired after: ", expiry);
    await redisClient.set(`blacklist:${tokenType}:${token}`, 'true', { EX: expiry });
};

export const logOut = async (req: Request, res: Response) => {
    try {
        const accessToken = req.signedCookies.accessToken;
        if (!accessToken) {
            res.status(401).json({ status: "failed", message: "Access token is required" });
            return;
        };
        const decodedToken = tokenDecoder(accessToken);
        const username = decodedToken.username;
        const refreshToken = await redisClient.get(username);
        if (!refreshToken) {
            res.status(401).json({ status: "failed", message: "Refresh token is required" });
            return;
        };
        addTokenBlacklist(accessToken, ACCESS_TOKEN_SECRET, "AccessToken");         // Add token blacklist for access token
        addTokenBlacklist(refreshToken, REFRESH_TOKEN_SECRET, "RefreshToken");      // Add token blacklist for refresh token
        res.clearCookie("accessToken");                                             // clear cookie for accessToken
        await redisClient.del(username);                                            // clear cookie in redis
        // verifyToken(refreshToken, REFRESH_TOKEN_SECRET);                            // check if it expire
        res.status(200).json({ status: "success", message: "Log out successfully" });
    } catch (error) {
        res.status(403).json({ status: "failed", message: 'Invalid or expired refresh token' });
    }
}