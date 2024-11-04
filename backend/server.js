import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js'
import messageRoutes from './routes/message.route.js'
import userRoutes from './routes/user.routes.js'
import connectDB from "./config/mongoConfig.js";
import cookieParser from "cookie-parser";
import { app , server } from "./socket/socket.js";
import path from "path";
dotenv.config();
connectDB();

const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
app.use('/api/users',userRoutes)

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
const port  = process.env.PORT || 4000;

server.listen(port , ()=>{console.log(`Server Running on port ${port} `)})

