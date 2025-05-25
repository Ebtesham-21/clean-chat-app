import jwt from "jsonwebtoken";
import {promisify} from "util";
const verifyToken = promisify(jwt.verify);
const SECRET = process.env.JWT_SECRET as string;
export default async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).json({error: "Token is required"});
    try {
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, SECRET, (err:any, decoded: unknown) => {
                if(err) return reject(err);
                resolve(decoded);
            });

        });
        // console.log(user, "user decoded");
        req.user = user;
        next();
    } catch(error:any){
        res.status(403).json({error: error.message });
    }

}