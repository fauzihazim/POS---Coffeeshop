import express from 'express';
import { addSupplier, banSupplier, editSupplier } from '../controllers/supplier';
import { authenticateAccessToken, isManager } from '../middleware/authMiddleware';
// import { isManager, isManagerOrBarista } from '../middleware/supplierMiddleware';
import { getIdempotencykey } from '../middleware/idempotencyMiddleware';

const app = express.Router();
app.post('/supplier/addSupplier', authenticateAccessToken, isManager, getIdempotencykey, addSupplier);
// app.post('/supplier/addSupplier', addSupplier);
app.patch('/supplier/editSupplier/:id', authenticateAccessToken, isManager, editSupplier);
app.patch('/supplier/banSupplier/:id', authenticateAccessToken, isManager, banSupplier);

export default app;