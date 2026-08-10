import 'dotenv/config';
import express from 'express';
import recommendRouter from './routes/recommend.js';
import cors from 'cors';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN })); // restricts who can call this API
app.use(express.json())                                  // lets req.body parse incoming json

app.use("/api/recommend", recommendRouter);

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
})

app.listen(process.env.PORT || 3001, () => {
    console.log("Server started");
})