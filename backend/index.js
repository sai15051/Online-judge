import express from 'express';
import router from "./routes/router.js";
import { DBConnection } from './database/db.js';
import dotenv from 'dotenv';
import cors from "cors";



const app = express()
// middlewares
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: ["http://localhost:5173",'https://online-judge-fj7y.vercel.app'],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use("/", router);

DBConnection();


app.listen(8001, () => {
    console.log("server is listening on port 8001")
});