import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true
    },
    description: {
        type: String,
        required:true,
        trim:true
    },
    state: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
        default: Date.now()
    },
    priority: {
        type: String,
        required:true,
        enum:["Low","Medium","High"]
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    finishBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},{ timestamps:true });

const Task = mongoose.model('Task', taskSchema);

export default Task;