import express from 'express';
import { itemIn } from '../controllers/item';
import { authenticateAccessToken, isManagerOrBarista } from '../middleware/authMiddleware';
const app = express.Router();

app.post('/itemIn/addItemIn', authenticateAccessToken, isManagerOrBarista, itemIn);

export default app;