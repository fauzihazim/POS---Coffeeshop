import express, { Request, Response } from 'express';
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());

import authRouter from './src/routes/authRoutes';
app.use(authRouter);

import supplierRoutes from './src/routes/supplierRoutes';
app.use(supplierRoutes);

import menuRoute from './src/routes/menuRoutes';
app.use(menuRoute);

import itemInRoutes from "./src/routes/itemInRoutes";
app.use(itemInRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Node.js!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
