import { Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User} from '../interfaces/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwtUtils';
import { redisClient } from '../config/redis';

// User
const createUser = async () => {
    const user: User = {
        username: "username",
        email: "john@example.com",
        password: await bcrypt.hash("password", 10)
    };
    console.log(`Password: ${user.password}`);
    return user;
}

let refreshTokens: string[] = [];

export const login = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } = req.body;
    try {
        // const [results] = await pool.query("select * from users where username = ?", [username]);
        // const user = results[0];
        const user = await createUser();
        if (user.username === username && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken({ username: user.username, email: user.email });
            // set cookies access and refresh token
            res.cookie('accessToken', accessToken, { signed: true, maxAge: 900000, httpOnly: true, domain: "localhost", secure: true });
            const refreshToken = generateRefreshToken({ username: user.username, email: user.email });
            // refreshTokens.push(refreshToken);
            // Store refresh token in Redis
            await redisClient.set(user.username, refreshToken);
            res.cookie('refreshToken', refreshToken, { signed: true, maxAge: 604800000, httpOnly: true, domain: "localhost", secure: true });
            res.status(200).json({ accessToken, refreshToken });
        } else {
            res.status(401).json({ message: "Invalid credential" });
        }
    } catch (error) {
        res.status(500).json({ message: "Login error" });
    }
}

export const getCookies = async (req: Request, res: Response) => {
    const cookies = req.signedCookies;
    res.send(JSON.stringify(cookies));
};

export const refreshToken = (req: Request, res: Response): void => {
    const { refreshToken }: { refreshToken: string } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        return;
    }
    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
    }
    try {
        const userPayload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret);
        const accessToken = generateAccessToken(userPayload);
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};