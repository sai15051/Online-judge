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
        origin: ["https://online-judge-fj7y.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.options('*', cors({
    origin: ["https://online-judge-fj7y.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://online-judge-fj7y.vercel.app'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');  
    next();
});
app.use("/", router);

DBConnection();


app.listen(8001, () => {
    console.log("server is listening on port 8001")
});