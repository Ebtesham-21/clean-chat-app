import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import prisma from './config/dbclient';
import { userRoute } from './routes/user';


const PORT = process.env.PORT || 5000;
const app: Application = express();


// Midleware
app.use(cors());
app.use(express.json({limit: "1GB"}));
app.use(fileUpload({}));
app.use(express.urlencoded({extended: true}));
app.use("/api/auth", userRoute);
app.get("/", (req: Request,  res:Response) => {
    return res.send("Welcome to the server");
})

const startServer = async () => {
    try{
        await prisma.$connect();
        console.log("Connected to database");
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } 
    
    catch(err){

    }
}

startServer();