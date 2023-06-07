import Task from "../models/Task.js";
import Project from "../models/Project.js";

const getTask = async (req, res) => {
    const {id} = req.params;
    try {
        const tasks = await Task.findById(id).populate("project");
        if(!tasks){
            return res.json({msg:'Task not found.', error:true});
        }
        if(tasks.project.creator.toString() !== req.user._id.toString()){
            return res.json({msg:'Task not permitted because you do not have access to this project.', error:true});
        }
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const newTask = async (req, res) => {
    const {project} = req.body;
    try {
        const proj = await Project.findById(project);
        if(!proj){
            return res.json({msg:'Project not found.', error:true});
        }
        if(proj.creator.toString() !== req.user._id.toString()){
            return res.json({msg:'Project not permitted.', error:true});
        }
        const resp = await Task.create(req.body);
        proj.tasks.push(resp._id);
        await proj.save();
        res.status(200).json(resp);
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const editTask = async (req, res) => {
    const {id} = req.params;
    try {
        const task = await Task.findById(id).populate("project");
        if(!task){
            return res.json({msg:'Task not found.', error:true});
        }
        if(task.project.creator.toString() !== req.user._id.toString()){
            return res.json({msg:'Task not permitted because you do not have access to this project.', error:true});
        }
        task.name = req.body.name || task.name;
        task.description = req.body.description || task.description;
        task.deadline = req.body.deadline || task.deadline;
        task.priority = req.body.priority || task.priority;

        const taskUpdated = await task.save();
        return res.status(200).json(taskUpdated);
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const deleteTask = async (req, res) => {
    const {id} = req.params;
    try {
        const task = await Task.findById(id).populate("project");
        const proj = await Project.findById(task.project._id); 
        if(!task){
            return res.json({msg:'Task not found.', error:true});
        }
        if(task.project.creator.toString() !== req.user._id.toString()){
            return res.json({msg:'Task not permitted because you do not have access to this project.', error:true});
        }
        proj.tasks = proj.tasks.pull(task._id);
        await proj.save();
        await task.deleteOne();
        return res.status(200).json({msg:'Task deleted.'});
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const setState = async (req, res) => {
    const {id} = req.params;
    try {
        const task = await Task.findById(id).populate("project");
        if(!task){
            return res.json({msg:'Task not found', error:true});
        }
        if(task.project.creator.toString() !== req.user._id.toString() && !task.project.collaborators.some(c=>c._id.toString() === req.user._id.toString())){
            return res.json({msg:'You are not the creator or a collaborator for this project', error:true});
        }
        task.state = !task.state;
        task.finishBy = req.user._id;
        await task.save();
        return res.status(200).json({msg:task.state?'Task completed':'Task is pending'});
    } catch (error) {
        
    }
};

export {
    getTask,
    newTask,
    editTask,
    deleteTask,
    setState
  };