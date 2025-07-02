import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readData, writeData } from "../utils/fileHandler.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_FILE = path.resolve(__dirname,"../data/users.json");
const JWT_SECRECT = "kishan@123";

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(400).json({ message: "Email and password are required." });
    }

    const users = await readData(USER_FILE)
    const exists = users.find((user) => user.email === email);
    if (exists) {
        return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), email, password: hashedPassword };

    await writeData(USER_FILE, [...users, newUser]);
    res.status(201).json({ message: "User registered successfully." });
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ message: "Email and password are required." });
    }

    const users = await readData(USER_FILE);
    
    const user = users.find((user) => user.email === email);
    const pass = await bcrypt.hash(password, 10);

    if (!user || !pass){
        return res.status(401).json({ message: "Invalid email or password." });
    }

    const userData = { id: user.id, email: user.email }

    const token = jwt.sign(userData, JWT_SECRECT);
    res.json({message: "Login successful.", token });

});

export default router;