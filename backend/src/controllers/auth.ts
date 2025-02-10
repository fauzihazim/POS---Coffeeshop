import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { getCookie, setCookie } from 'typescript-cookie';
// import { config } from "dotenv";

// config();

// User
interface User {
    username: string;
    email: string;
    password: string;
}
const createUser = async () => {
    // const hashedPassword = await bcrypt.hash("password", 10);
    const user: User = {
        username: "username",
        email: "john@example.com",
        password: await bcrypt.hash("password", 10)
    };
    console.log(`Password: ${user.password}`);
    return user;
}

const generateAccessToken = (user: object) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '150m' });
};

const generateRefreshToken = (user: object) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret);
};

export const login = async (req: Request, res: Response) : Promise<void> => {
    const { username, password }: { username: string; password: string } = req.body;
    try {
        // const [results] = await pool.query("select * from users where username = ?", [username]);
        // const user = results[0];
        const user = await createUser();
        if (user.username === username && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken({ username: user.username, email: user.email });
            // set cookies access token
            // setCookie('access token', accessToken, { expires: 1 });
            res.cookie('accessToken', accessToken, { signed: true, maxAge: 900000, httpOnly: true, domain: "localhost", secure: true });
            const refreshToken = generateRefreshToken({ username: user.username, email: user.email });
            // refreshTokens.push(refreshToken); // Store refresh token
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