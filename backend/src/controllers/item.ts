import { Request, Response } from "express";
import { ItemIn, PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

// const prisma = New Prisma()
const prisma = new PrismaClient();

export const itemIn = async (req: Request, res: Response) => {
    const { itemIn }: { itemIn: ItemIn[] } = req.body;
    const batchItemInId =  uuidv4();
    const dateItemReceived = new Date(Date.now());
    const decodedAccessToken = res.locals.decodedAccessToken;
    const receiverId: number = decodedAccessToken.userId;

    console.log("Batch Item In Id: ", batchItemInId, " date item received ", dateItemReceived, " receiver Id ", receiverId);
    
    const itemInData = itemIn.map(item => ({
        ...item,
        batchItemInId, // Generate UUID
        dateItemReceived, // Use current date and time
        receiverId
    }));
    console.log("Item in array ", itemInData);
    
    try {
        const prismaTransaction = await prisma.$transaction(async (prisma) => {
            const addItemIn = await prisma.itemIn.createMany({
                data: itemInData
            });
            return addItemIn;
        });
        console.log("Item in ", prismaTransaction);
        res.status(201).json({ status: "sucess", message: "success adding", data: itemInData });
    } catch (error: any) {
        res.status(500).json({ status: "failed", message: error.message })
    }
    
}