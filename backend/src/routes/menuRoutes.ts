import express from "express";
import { addMenu } from "../controllers/menu";

const app = express.Router();

app.post('/menu/addMenu', addMenu);

export default app;