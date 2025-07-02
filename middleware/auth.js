import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/config.js";

export function authenticateToken( req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Missing Token." });
    }

    console.log("Token received:", token);

    try {
        const authUser = jwt.verify( token, JWT_SECRET);
        req.user = authUser;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "Invalid Token." });
    }    
}