import express from "express";
import { addMenu, deleteMenu, editRecipe, soldOutMenu } from "../controllers/menu";
import { authenticateAccessToken, isManager } from "../middleware/authMiddleware";
// import { isManager } from "../middleware/supplierMiddleware";

const app = express.Router();

app.post('/menu/addMenu', authenticateAccessToken, isManager, addMenu);
app.patch('/menu/editRecipe/:id', authenticateAccessToken, isManager, editRecipe);
app.delete('/menu/deleteMenu/:id', authenticateAccessToken, isManager, deleteMenu);
app.patch('/menu/soldOutMenu/:id', authenticateAccessToken, isManager, soldOutMenu);

export default app;