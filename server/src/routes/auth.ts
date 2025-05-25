import prisma from "../config/dbclient";    
import {Router} from "express";
import {UploadedFile} from "express-fileupload"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {auth} from "../middleware/user";
export const authRoute = Router();
const SECRET = process.env.JWT_SECRET as string;

authRoute.post("/register", async (req, res:any) => {
    try {
        const {name, email, password} = req.body;
        console.log(req?.body, req.files, "data");
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });
        
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        let file;
        if(req.files){
            file = req.files?.profileImage as UploadedFile;
        let storagePath = getStoragePath(file);
       
        console.log(storagePath,
            "storage path"
        );
        await file.mv(storagePath);


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
        return res.status(200).json({user})
    }catch(error:any){
        res.status(500).json({message:error?.message});
    }
});


authRoute.post("/login", async(req , res:any) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(404).json({message: "Email or password is wrong. "});
        }
        const validPassword = await bcrypt.compare(password, user.password );
        if(!validPassword) {
            return res.send(400).json({error: "Invalid password"});
        }

        const token = jwt.sign({id: user.id}, SECRET) ;
        res.send(200).json({  token, user });

    }  catch(error:any){
        res.status(500).json({message: error?.message});
    }
});




