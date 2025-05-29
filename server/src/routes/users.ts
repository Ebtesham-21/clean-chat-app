import prisma from "../config/dbclient";    
import {Router} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import auth from "../middleware/user";

export const usersRoute = Router();

usersRoute.get("/users", auth, async (req: any, res) => {
    try {
        console.log("Decoded user from token:", req.user);
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req?.user?.id,
                },
            },
        });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error?.message});

    }
})
usersRoute.get("/user", auth, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req?.user?.id,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
});
