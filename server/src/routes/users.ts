import prisma from "../config/dbclient";    
import {Router} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userRoute = Router();

userRoute.get("/users", auth, async (req: any, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req?.user?.id,
                },
            },
        }),
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error?.message});

    }
})
userRoute.get("/user", auth, async (req: any, res) => {
    try {
        const user = await req.user;
        console.log(user);
        const users = await prisma.user.findUnique({
            where: {
                id: req?.user?.id,
                    
                
            },
        }),
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error?.message});

    }
})