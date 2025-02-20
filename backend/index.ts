import express, { Request, Response } from 'express';
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());

import authRouter from './src/routes/auth';
app.use(authRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Node.js!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
