import express from 'express';
import { addSupplier, banSupplier, editSupplier } from '../controllers/supplier';
import { authenticateAccessToken } from '../middleware/authMiddleware';
import { isManager, isManagerOrBarista } from '../middleware/supplierMiddleware';

const app = express.Router();
app.post('/supplier/addSupplier', authenticateAccessToken, isManager, addSupplier);
app.post('/supplier/editSupplier/:id', authenticateAccessToken, isManager, editSupplier);
app.post('/supplier/banSupplier/:id', authenticateAccessToken, isManager, banSupplier);

export default app;