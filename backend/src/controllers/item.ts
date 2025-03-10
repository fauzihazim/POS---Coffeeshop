import { Request, Response } from "express";
import { ItemIn, PrismaClient, StatusInventory } from "@prisma/client";
import { redisClient } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';

// const prisma = New Prisma()
const prisma = new PrismaClient();

export const addItemIn = async (req: Request, res: Response) => {
    const { itemIn }: { itemIn: ItemIn[] } = req.body;
    const batchItemInId =  uuidv4();
    // Extract local date and time components
    const expTime: Date = new Date();
    expTime.setDate(expTime.getDate() + 5);
    const year: number = expTime.getFullYear();
    const month: string = String(expTime.getMonth() + 1).padStart(2, '0');  // Months are 0-based, so add 1
    const day: string = String(expTime.getDate()).padStart(2, '0');     // Add 5 days to check expired
    const hours: string = String(expTime.getHours()).padStart(2, '0');
    const minutes: string = String(expTime.getMinutes()).padStart(2, '0');
    const seconds: string = String(expTime.getSeconds()).padStart(2, '0');
    const milliseconds: string = String(expTime.getMilliseconds()).padStart(3, '0');

    // Format the local datetime as a string
    const dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
    console.log("Date ", dateString);
    
    const dateNow = new Date(dateString);
    console.log("Date Now: ", dateNow);
    
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

cron.schedule('00 00 * * *', async () => {
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const month: string = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based, so add 1
    const day: string = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day} 00:00:00.000Z`

    const dateNow = new Date(dateString);
    console.log("Date Now: ", dateNow);

    console.log("Date ", dateNow);

    const getPrisma = await prisma.inventory.updateMany({
        where: {
            OR: [
                {expired: {
                    lt: dateNow
                },
            },
            { expired: dateNow },

            ], status: StatusInventory.available
        },
        data: {
            status: StatusInventory.expired,
        }
    });
    console.log("Check Expired running");
    
}, { timezone: 'Asia/Jakarta' });