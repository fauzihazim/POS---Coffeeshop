import express from 'express';
import cookieParser from 'cookie-parser';

const app = express.Router();
app.use(cookieParser('yourSecretKey'));

import { login, getCookie, refreshToken, logOut, clearCookie } from "../controllers/auth";

app.post('/login', login);
app.get('/getCookie', getCookie);
app.post('/refreshToken', refreshToken);
app.post('/logOut', logOut);
app.get('/clearCookie', clearCookie);

export default app;