import prisma from "../config/dbclient";    
import {Router} from "express";
import {auth} from "../middleware/user";
export const messageRoute = Router();

messageRoute.post("/create",auth, async(req:any, res) => {
    try {
        const {receiverId, content} = req.body;
        const userId = req?.user?.id;
        if(!userId) return res.status(401).json({error: "Unauthorized"});
    } catch(err:any) {
        res.status(500).json({message: err.message});
    }
});