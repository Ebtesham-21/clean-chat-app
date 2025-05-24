import prisma from "../config/dbclient";
import { Router } from "express";
import {UploadedFile} from "express-fileupload";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getStoragePath } from "../config/storage";
export const userRoute = Router();


userRoute.post("/register", async (req, res:any) => {
    try {
        const {name, email, password} = req.body;
        console.log(req?.body, req.files, "data")
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        
        if (existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }
        let file;
        if(req?.files){
            file = req.files?. profileImage as UploadedFile;
            let storagePath = getStoragePath(file );
            await file.mv(storagePath) 
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                profileImage: file ? file.name : null,

            },
        });
        return res.status(200).json({user});
} catch (error: any) {
    res.status(500).json({
        message: error?.message
}

);

}
});

userRoute.post("/login", async(req, res:any) =>{
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) {
            return res.status(404).json({message:"Email or password is wrong"})
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.send(400).json({error: "Invalid password"});
        }
const token = jwt.sing({id: user.id}, process.env.JWT_SECRET);
res.send(200).json({token:token, user})
    } catch (error: any) {
        res.status(500).json({message:error?.message})
    }
})