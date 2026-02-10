import express from 'express';
import cors from 'cors'
import connectDB from './config/DbConnection.js';
import 'dotenv/config.js';
import authRoute from './routes/authRoutes.js';

const app = express()

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '5mb' }));


const PORT = process.env.PORT || 3000

app.use('/api/auth', authRoute);

const startServer = async () => {
  await connectDB(process.env.MONGODB_URL);
  app.listen(PORT, () => { console.log("Server Started at " + PORT) });
};

startServer();