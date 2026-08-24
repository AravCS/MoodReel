import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import recommendRouter from './routes/recommend.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN })); // restricts who can call this API
app.use(express.json())                                  // lets req.body parse incoming json

app.use("/api/recommend", recommendRouter);

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
})

export default app;
