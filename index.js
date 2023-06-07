import express from "express";
import dotenv from "dotenv";
import conectarDb from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
dotenv.config();
conectarDb();

//configuring CORS
const whiteList=[process.env.FRONTEND_URL];
const corsOptions={
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            callback(null,true);
        }
        else{
            callback(new Error('CORS fail in white list.'));
        }
    }
};
app.use(cors(corsOptions));

//Routing
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT,()=>{
    console.log('Server running in port: ' + PORT);
});

//SOCKET IO
import { Server } from 'socket.io';

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', (socket)=>{
    //console.log('Connected to Socket.io');
    
    //define events for socket
    socket.on('Open Project', (id)=>{
        //console.log('From project ', id);
        socket.join(id);
    });

    socket.on('New Task', (idProj)=>{
        socket.to(idProj).emit('Task Added',idProj);
    });

    socket.on('Delete Task', (idProj)=>{
        socket.to(idProj).emit('Task Deleted',idProj);
    });

    socket.on('Update Task', (idProj)=>{
        socket.to(idProj).emit('Task Updated',idProj);
    });

    socket.on('Change State Task', (idProj)=>{
        socket.to(idProj).emit('Task State Changed',idProj);
    });
});