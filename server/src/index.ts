import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import prisma from './config/dbclient';
import {Server} from 'socket.io';
import { usersRoute, authRoute, messageRoute  } from './routes'; // Adjust path as needed
import { appMessages } from './sockets/socket';



const PORT = process.env.PORT || 5000;
const app: Application = express();

// middleware
app.use(cors());
app.use(express.json({limit: '1gb'}));
app.use(fileUpload())
app.use(express.urlencoded({extended: false}));
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/message", messageRoute);

app.get("/", (req:Request, res:any) => {
    return res.send("Welcome to the server");
})

const startServer = async () => {
    try{
        await prisma.$connect();
        console.log("Connected to database");
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
        const socketIo = new Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: ["http//localhost:3000"],
                methods: ["GET", "POST"],
            },
        });
        console.log(socketIo);
        socketIo.on("connection", (socket) => {
            appMessages(socket, socketIo)
        })
    } 
    
    catch(err){
        console.log("Failed to connect to database", err.message);
        process.exit(1);
    }
};

startServer();