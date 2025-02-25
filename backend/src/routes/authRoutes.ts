import express from 'express';
import cookieParser from 'cookie-parser';
import { login, getCookie, refreshToken, logOut, clearCookie } from "../controllers/auth";
// import { checkAccessTokenIsRequire, checkBlacklist, checkRefreshTokenIsRequire, decodedAccessToken, verifyRefreshToken, decodedRefreshToken } from '../middleware/authMiddleware';
import { authenticateAccessToken, authenticateRefreshToken } from '../middleware/authMiddleware';
// Middleware
// const refreshTokenMiddleware = [checkAccessTokenIsRequire, decodedAccessToken, checkRefreshTokenIsRequire, decodedRefreshToken, verifyRefreshToken, checkBlacklist];

const app = express.Router();
app.use(cookieParser('yourSecretKey'));

app.post('/login', login);
app.get('/getCookie', authenticateAccessToken, authenticateRefreshToken, getCookie);
// app.get('/getCookie', getCookie);
app.post('/refreshToken', authenticateRefreshToken, refreshToken);
// app.post
app.post('/logOut', authenticateRefreshToken, logOut);
app.get('/clearCookie', clearCookie);

export default app;