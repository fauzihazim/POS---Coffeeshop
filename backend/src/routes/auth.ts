import express from 'express';
import cookieParser from 'cookie-parser';

const app = express.Router();
app.use(cookieParser('yourSecretKey'));

import { login, getCookie, refreshToken } from "../controllers/auth";

app.post('/login', login);
app.get('/getCookie', getCookie);
app.post('/refreshToken', refreshToken);

export default app;