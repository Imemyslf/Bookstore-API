import express from 'express';
import authRoutes from '../routes/auth.js';
import bookRoutes from '../routes/book.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDB } from './database.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const swaggerDoc = YAML.load('./docs/swagger.yaml');




app.use(express.json());
app.use(morgan('dev'));

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

if (process.env.NODE_ENV !== 'test') {
  connectToDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
  });
});
}

export default app;
