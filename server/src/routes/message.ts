import prisma from "../config/dbclient";    
import {Router} from "express";
import {auth} from "../middleware/user";
export const messageRoute = Router();

messageRoute.post("/create",auth, async(req:any, res:any) => {
    try {
        const {receiverId, content} = req.body;
        const userId = req?.user?.id;
        if(!userId) return res.status(401).json({error: "Unauthorized"});
        if(!receiverId || !content) return res.status(401).json({error: "Receiver id and content are required"});
        const message = await prisma.message.create({
            data: {
                content: content as string,
                senderId: userId as number,
                receiverId: receiverId as number,


            }
        });
        res.status(200).json(message);
    } catch(err:any) {
        res.status(500).json({message: err.message});
    }
});

// get messages
messageRoute.get("/", auth, async(req:any, res:any) => {
    try {
        const {senderId } = req.query;
        const userId = req?.user?.id;
        if(!userId) return res.status(401).json({error: "Unauthorized"});
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {senderId: Number(userId), 
                    receiverId: Number(senderId)},
                    {senderId: Number(senderId), 
                    receiverId: Number(userId)}
                ]
            },
            include: {
                sender: true,
                receiver: true,
            },
        });
        res.json(messages);

    } catch(error:any) {
        res.status(500).json({message:error.message});

    }
})