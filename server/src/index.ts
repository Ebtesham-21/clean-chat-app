import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import path from 'path';
import prisma from './config/dbclient';

const app: Application = express();

const startServer = async () => {
    try{
        await prisma.$connect();
    }
    
    catch(err){

    }
}