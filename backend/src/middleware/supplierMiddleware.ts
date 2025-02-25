import { Request, Response, NextFunction } from 'express';
import { checkUserIsManager, checkUserIsBarista } from './authMiddleware';

export const isManagerOrBarista = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isManager = checkUserIsManager(req, res);
        const isBarista = checkUserIsBarista(req, res);
        if ((isManager || isBarista) && !(isManager && isBarista)) {
            next();
            return;
        };
        res.status(401).json({ status: "failed", message: 'You are not manager or barista' });
    } catch (error) {
        res.status(500).json({ status: "failed", message: 'Internal server error' });
    }
}

export const isManager = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isManager = checkUserIsManager(req, res);
        if (isManager) {
            next();
            return;
        };
        res.status(401).json({ status: "failed", message: 'You are not manager' });
    } catch (error) {
        res.status(500).json({ status: "failed", message: 'Internal server error' });
    }
}