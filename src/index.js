import express from 'express';
import authRoutes from '../routes/auth.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
})