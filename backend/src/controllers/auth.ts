import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/User';
import { DecodedToken } from '../interfaces/Decode';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwtUtils';
import { redisClient } from '../config/redis';

import { pool } from '../config/db';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;

// User
const createUser = async () => {
    const user: User = {
        username: "username",
        email: "john@example.com",
        password: await bcrypt.hash("password", 10),
        role: "Barista"
    };
    console.log(`Password: ${user.password}`);
    return user;
}

export const login = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } = req.body;
    try {
        const [results] = await pool.query("SELECT username, password, email, role FROM user WHERE username = ?", [username]);
        // Type assertion for results
        const result = results as User[];
        const user = result[0];
        if (user.username) {
            const accessToken = generateAccessToken({ username: user.username, email: user.email, role: user.role });
            // set cookies access and refresh token
            res.cookie('accessToken', accessToken, { signed: true, maxAge: 1200000, httpOnly: true, domain: "localhost", secure: true });
            const refreshToken = generateRefreshToken({ username: user.username, email: user.email, role: user.role });
            await redisClient.set(user.username, refreshToken, {
                EX: 24 * 60 * 60, // Set expiration time to 24 hours
            });
            res.status(200).json({ accessToken, refreshToken });
        } else {
            res.status(401).json({ message: "Invalid credential" });
        }
    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
}

export const getCookies = async (req: Request, res: Response) => {
    const cookies = getSpesificCookies(req, res, "accessToken");
    res.send(JSON.stringify(cookies));
};

const getSpesificCookies = async (req: Request, res: Response, cookieName: String) => {
    const cookies = req.signedCookies;
    if (cookies) {
        console.log("Cookies access token :", req.signedCookies.accessToken);
        return req.signedCookies.accessToken;
    } else {
        res.status(404).send({ error: 'Cookie not found' });
        return 0;
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    const accessToken = req.signedCookies.accessToken;
    const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as DecodedToken;
    const username = decodedToken.username;
    const refreshToken: string | null = await redisClient.get(username);

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        return;
    };
    try {
        verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret);
        const accessToken = generateAccessToken({ username: decodedToken.username, email: decodedToken.email, role: decodedToken.role });
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};