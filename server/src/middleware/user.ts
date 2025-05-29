import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export default async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = decoded;
      // Optional: log for debug
      console.log("Authenticated user:", decoded);
      next();
    });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};
