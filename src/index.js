import express from 'express';
import authRoutes from '../routes/auth.js';
import bookRoutes from '../routes/book.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
  });
}

export default app;
