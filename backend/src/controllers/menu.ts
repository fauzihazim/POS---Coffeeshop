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
        res.status(201).json({ status: "success", message: "Menu added successfully", newMenu });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "error server", error})
    }
}

export const editRecipe = async (req: Request, res: Response) => {
    // This function will assign old menu status from available or soldOut into recipeChange and create new menu as if the old menu was edited.
    const menuId = parseInt(req.params.id);
    const { menuName, menuDescription, menuPrice, recipeList }: { menuName: string; menuDescription: string; menuPrice: number; recipeList: RecipeItem[] } = req.body;

    if (!menuId) {
        res.status(400).json({ status: "failed", messsage: "Menu Id can not be null" });
        return;
    };
    // Validate recipeList
    if (!recipeList || recipeList.length === 0) {
        res.status(400).json({ status: "failed", message: "Recipe list cannot be empty" });
        return;
    }

    // Validate menuPrice
    if (menuPrice && (isNaN(menuPrice) || menuPrice < 0)) {
        res.status(400).json({ status: "failed", message: "Invalid menu price" });
        return;
    }
    
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // Operation 1: Update the existing menu
            const editedMenu = await prisma.menu.update({
                where: { menuId: menuId },
                data: { status: MenuStatus.recipeChange },
            });
          
            // Operation 2: Create a new menu
            const newMenu = await prisma.menu.create({
                data: {
                    menuName: menuName ?? editedMenu.menuName,
                    menuDescription: menuDescription ?? editedMenu.menuDescription,
                    price: menuPrice ?? editedMenu.price, // Price in cents (e.g., $16.00)
                    status: MenuStatus.available,
                    Recipe: {
                        create: recipeList
                    },
                },
            });
            return newMenu;
        });
        res.status(201).json({ status: "success", message: "Menu changed successfully", data: { menu: result, recipe: recipeList } });
    } catch (error: any) {
        res.status(500).json({ status: "failed", message: "Failed to edit menu" });
    }
}

export const deleteMenu = async (req: Request, res: Response) => {
    // It implement soft delete
    const menuId = parseInt(req.params.id);

    if (!menuId) {
        res.status(400).json({ status: "failed", messsage: "Menu Id can not be null" });
        return;
    };

    try {
        const deletingMenu = await prisma.menu.update({
            where: { menuId: menuId },
            data: { status: MenuStatus.removed },
        });
        res.status(201).json({ status: "success", message: "Menu deleted successfully", data: { menu: deletingMenu } });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Failed to delete menu" });
    };
}

export const soldOutMenu = async (req: Request, res: Response) => {
    // It implement soft delete
    const menuId = parseInt(req.params.id);

    if (!menuId) {
        res.status(400).json({ status: "failed", messsage: "Menu Id can not be null" });
        return;
    };

    try {
        const soldOutMenu = await prisma.menu.update({
            where: { menuId: menuId },
            data: { status: MenuStatus.soldOut },
        });
        res.status(201).json({ status: "success", message: "Menu status updated to sold out", data: { menu: soldOutMenu } });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Failed to delete menu" });
    };
}