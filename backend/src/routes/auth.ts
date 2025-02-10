import express from 'express';
import cookieParser from 'cookie-parser';

const app = express.Router();
app.use(cookieParser('yourSecretKey'));

import { login, getCookies } from "../controllers/auth";

app.get('/login', login);
app.get('/getCookies', getCookies);

export default app;