// import recipeItem from 
import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient, Prisma } from "@prisma/client";

import { RecipeItem } from '../interfaces/RecipeItem';
import { MenuStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const addMenu = async (req: Request, res: Response) => {
    const { menuName, menuDescription, menuPrice, recipeList }: { menuName: string; menuDescription: string; menuPrice: number; recipeList: RecipeItem[] } = req.body;
    if (!menuName || !menuDescription || !menuPrice || !recipeList) {
        res.status(400).send('Invalid request data');
        return;
    };

    try {
        const newMenu = await prisma.menu.create({
            data: {
              menuName: menuName,
              menuDescription: menuDescription,
              price: menuPrice, // Price in cents (e.g., $16.00)
              status: MenuStatus.available,
              Recipe: {
                create: recipeList,
              },
            },
        });
        console.log("Menu: ", menuName, " Description: ", menuDescription, " Price: ", menuPrice, " Recipe List ", recipeList);
        // res.status(200).send('Valid request data');

        res.status(201).json({ status: "success", message: "Successfully edited supplier", newMenu });
        
    } catch (error) {
        res.status(500).json({ status: "failed", message: "error server", error})
    }

}