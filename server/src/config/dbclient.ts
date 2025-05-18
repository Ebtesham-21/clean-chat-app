import { PrismaClient } from '../generated/prisma';


const prisma = new PrismaClient({
    log: ['query', 'error'],
    errorFormat: 'pretty',
})

export default prisma;