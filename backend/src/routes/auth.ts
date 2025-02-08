import express from 'express';
const app = express.Router();

import { login } from "../controllers/auth";

app.get('/login', login);

export default app;