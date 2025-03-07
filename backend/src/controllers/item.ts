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

    // const result = itemIn.map(obj => {

    //     // if (obj.expired <= "2025-12-31T23:59:59.000Z") {
    //     //     console.log("Expired");
            
    //     // }
    // });

    const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
    ];
    
    const names = users.map(user => user.name);
    console.log(names); // Output: ['Alice', 'Bob', 'Charlie']
    

    // if (itemIn.expi)

    console.log("Batch Item In Id: ", batchItemInId, " date item received ", dateNow, " receiver Id ", receiverId);
    
    // const itemInData = itemIn.map(item => ({
    //     ...item,
    //     expired: new Date(item.expired),
    //     batchItemInId, // Generate UUID
    //     dateItemReceived: dateNow, // Use current date and time
    //     receiverId
    // }));
    
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
        console.log("Item in array Datas ", itemInData);
        // const prismaTransaction = await prisma.$transaction(async (prisma) => {
        //     const addItemIn = await prisma.itemIn.createMany({
        //         data: itemInData
        //     });
        //     const addInventory = await prisma.inventory
        //     return addItemIn;
        // });
        // console.log("Item in ", prismaTransaction);
        const prismaTransaction = await prisma.$transaction(async (prisma) => {
            // Use prisma.itemIn.create in a loop to return created records
            const createdItemIn = await Promise.all(
                itemInData.map(item =>
                    prisma.itemIn.create({
                        data: item,
                    })
                )
            );
            // return createdItemIn;
            // const itemInDatas = itemIn.map(item => ({
            //     ...item,
            //     batchItemInId, // Generate UUID
            //     dateItemReceived, // Use current date and time
            //     receiverId
            // }));
            const createdInventory = await Promise.all(
                // itemInData.map(item =>
                //     prisma.itemIn.create({
                //         data: item,
                //     })
                // )
                // createdItemIn.map(item => ({barcodeItem: item.barcodeItem, itemInId: batchItemInId, expired: item.expired, remainingItem: item.totalItemReceived, status: StatusInventory.available}))
                createdItemIn.map(item => prisma.inventory.createMany({data: {barcodeItem: item.barcodeItem, itemInId: item.itemInid as unknown as number, expired: item.expired, remainingItem: item.totalItemReceived, status: StatusInventory.available}}))
            );
            // const itemInventory = createdItemIn.map(obj => ({barcodeItem: obj.barcodeItem, itemInId: batchItemInId, expired: obj.expired, remainingItem: obj.totalItemReceived, status: StatusInventory.available}));
            // console.log("Item inventory ", itemInventory);
            
            return { createdItemIn, createdInventory };
        });

        res.status(201).json({
            status: 'success',
            message: 'Items added successfully',
            data: prismaTransaction,
        });
        // res.status(201).json({ status: "sucess", message: "success adding", data: itemInData });
    } catch (error: any) {
        res.status(500).json({ status: "failed", message: error.message })
    }
    
}