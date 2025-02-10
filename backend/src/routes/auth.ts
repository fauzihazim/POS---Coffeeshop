import express from 'express';
import cookieParser from 'cookie-parser';

const app = express.Router();
app.use(cookieParser('yourSecretKey'));

import { login } from "../controllers/auth";

app.get('/login', login);

export default app;