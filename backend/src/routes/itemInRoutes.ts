import express from 'express';
import { addItemIn } from '../controllers/item';
import { authenticateAccessToken, isManagerOrBarista } from '../middleware/authMiddleware';
const app = express.Router();

app.post('/itemIn/addItemIn', authenticateAccessToken, isManagerOrBarista, addItemIn);

export default app;