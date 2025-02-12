import { Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User} from '../interfaces/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwtUtils';
import { redisClient } from '../config/redis';

import { pool } from '../config/db';

// User
const createUser = async () => {
    const user: User = {
        Username: "username",
        Email: "john@example.com",
        Password: await bcrypt.hash("password", 10),
        Role: "Barista"
    };
    console.log(`Password: ${user.Password}`);
    return user;
}

let refreshTokens: string[] = [];

export const login = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } = req.body;
    // try {
    //     // const [results] = await pool.query("select * from users where username = ?", [username]);
    //     // const user = results[0];
    //     // const user = await createUser();
    //     // const [results]  = await pool.query("select * from users where username = ?", [username]);

    //     // pool.query("select * from users where username = ?", function(err: unknown, results: any[]){
    //     //     // if (err){ 
    //     //     //   throw err;
    //     //     // }
    //     //     // console.log(results[0].objid); // good
    //     //     // stuff_i_want = results[0].objid;  // Scope is larger than function

    //     //     // return callback(results[0].objid);
    //     //     if (err) throw err;
    //     //     console.log(results);
    //     // })

    //     pool.query('SELECT * FROM users WHERE username = ?', [username], (err: MysqlError | null, results: any[]) => {
    //         if (err) {
    //           res.status(500).send('Error querying the database');
    //           throw err;
    //         }
        
    //         if (results.length > 0) {
    //           const user = results[0];
    //           res.json(user);
    //         } else {
    //           res.status(404).send('User not found');
    //         }
    //     });


    //     // const user = results[0];
    //     // if (user.username === username && await bcrypt.compare(password, user.password)) {
    //     //     const accessToken = generateAccessToken({ username: user.username, email: user.email, role: user.role });
    //     //     // set cookies access and refresh token
    //     //     res.cookie('accessToken', accessToken, { signed: true, maxAge: 900000, httpOnly: true, domain: "localhost", secure: true });
    //     //     const refreshToken = generateRefreshToken({ username: user.username, email: user.email, role: user.role });
    //     //     // refreshTokens.push(refreshToken);
    //     //     // Store refresh token in Redis
    //     //     await redisClient.set(user.username, refreshToken);
    //     //     res.cookie('refreshToken', refreshToken, { signed: true, maxAge: 604800000, httpOnly: true, domain: "localhost", secure: true });
    //     //     res.status(200).json({ accessToken, refreshToken });
    //     // } else {
    //     //     res.status(401).json({ message: "Invalid credential" });
    //     // }
    // } catch (error) {
    //     res.status(500).json({ message: "Login error" });
    // }
    try {
        const [results] = await pool.query("SELECT Username, Password, Role FROM User WHERE Username = ?", [username]);

        // Type assertion for results
        const result = results as User[];
        const user = result[0];
        if (user.Username && await bcrypt.compare(password, user.Password)) {
            // return users[0]; // Return the first user found
            // res.status(200).json(user);
            const accessToken = generateAccessToken({ username: user.Username, email: user.Email, role: user.Role });
            // set cookies access and refresh token
            res.cookie('accessToken', accessToken, { signed: true, maxAge: 900000, httpOnly: true, domain: "localhost", secure: true });
            const refreshToken = generateRefreshToken({ username: user.Username, email: user.Email, role: user.Role });
            // refreshTokens.push(refreshToken);
            // Store refresh token in Redis
            await redisClient.set(user.Username, refreshToken);
            res.cookie('refreshToken', refreshToken, { signed: true, maxAge: 604800000, httpOnly: true, domain: "localhost", secure: true });
            res.status(200).json({ accessToken, refreshToken });
        } else {
            // return null; // No user found
            res.status(401).json({ message: "Invalid credential" });
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        throw err; // Re-throw the error for the caller to handle
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