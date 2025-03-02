import { Request, Response, NextFunction } from 'express';

export const getIdempotencykey = (req: Request, res: Response, next: NextFunction) => {
    const idempotencyKey = req.headers['idempotency-key'] as string;
    // console.log("The idempotency key from backend: ", idempotencyKey);
    if (!idempotencyKey) {
        res.status(400).json({ error: 'Idempotency key is required' });
        return;
    };
    res.locals.idempotencyKey = idempotencyKey;
    next();
}