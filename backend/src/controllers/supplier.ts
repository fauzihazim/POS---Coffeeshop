import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

// const prisma = New Prisma()
const prisma = new PrismaClient();

export const addSupplier = async (req: Request, res: Response) => {
    const { supplierName, supplierContact } : { supplierName: string; supplierContact: string } = req.body;
    try {
        const supplier = await prisma.supplier.create({
            data: {
                supplierName: supplierName,
                supplierContact: supplierContact,
            },
        });
        res.status(201).json({ status: "success", message: "Success adding Supplier Data", supplier });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Failed adding Supplier Data" });
    }
}

export const editSupplier = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { supplierName, supplierContact } : { supplierName: string; supplierContact: string } = req.body;
    try {
        if (!supplierName || !supplierContact) {
            res.status(401).json({ status: "failed", messge: "Supplier Name and Supplier Contact cannot be empty!" });
            return;
        }
        const updateUser = await prisma.supplier.update({
            where: {
                supplierId: id,
            },
            data: {
                supplierName: supplierName,
                supplierContact: supplierContact,
            },
        });
        res.status(201).json({ status: "success", message: "Successfully edited supplier", updateUser });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Failed edited supplier" });
    }
}

export const banSupplier = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        if (!id) {
            res.status(401).json({ status: "failed", messge: "Id Supplier cannot be empty!" });
            return;
        }
        const updateUser = await prisma.supplier.update({
            where: {
                supplierId: id,
            },
            data: {
                isBan: "true"
            },
        });
        res.status(201).json({ status: "success", message: "Successfully edited supplier", updateUser });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Failed edited supplier" });
    }
}