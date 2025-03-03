import express from "express";
import { addMenu, editMenu } from "../controllers/menu";

const app = express.Router();

app.post('/menu/addMenu', addMenu);
app.post('/menu/editMenu/:id', editMenu);

export default app;