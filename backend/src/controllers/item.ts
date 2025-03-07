import { Request, Response } from "express";
import { ItemIn, PrismaClient, StatusInventory } from "@prisma/client";
import { redisClient } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

// const prisma = New Prisma()
const prisma = new PrismaClient();

export const addItemIn = async (req: Request, res: Response) => {
    const { itemIn }: { itemIn: ItemIn[] } = req.body;
    const batchItemInId =  uuidv4();
    const dateNow = new Date(Date.now());
    const decodedAccessToken = res.locals.decodedAccessToken;
    const receiverId: number = decodedAccessToken.userId;
    try {
        const itemInData = itemIn.map(item => {
            // Add conditional logic here
            const expired = new Date(item.expired);
            if (item.totalItemReceived <= 0) {
                throw new Error(`Invalid totalItemReceived for item with barcode ${item.barcodeItem}`);
            };
            if (expired <= dateNow) {
                throw new Error(`Your item with barcode ${item.barcodeItem}, has been expired`);
            };
            return {
                ...item,
                expired,
                batchItemInId, // Generate UUID
                dateItemReceived: dateNow, // Use current date and time
                receiverId
            };
        });
        const prismaTransaction = await prisma.$transaction(async (prisma) => {
            // Use prisma.itemIn.create in a loop to return created records
            const createdItemIn = await Promise.all(
                itemInData.map(item =>
                    prisma.itemIn.create({
                        data: item,
                    })
                )
            );
            const createdInventory = await Promise.all(
                createdItemIn.map(item => prisma.inventory.createMany({
                    data: {
                        barcodeItem: item.barcodeItem,
                        itemInId: item.itemInid as unknown as number,
                        expired: item.expired,
                        remainingItem: item.totalItemReceived,
                        status: StatusInventory.available
                    }})
                )
            );
            return { createdItemIn, createdInventory };
        });
        res.status(201).json({
            status: 'success',
            message: 'Items added successfully',
            data: prismaTransaction,
        });
    } catch (error: any) {
        res.status(500).json({ status: "failed", message: error.message })
    }
    
}