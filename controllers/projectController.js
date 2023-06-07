import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
    const projects = await Project.find({
        $or:[
            { collaborators: {$in: req.user}},
            { creator: {$in: req.user}}
        ]
    }).select("-tasks");
    res.status(200).json(projects);
};

const newProject = async (req, res) => {
    const newProy = new Project(req.body);
    newProy.creator = req.user._id;
    try {
        const resp = await newProy.save();
        res.status(200).json(resp);
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const getProject = async (req, res) => {
    const {id}=req.params;
    try{
        const proj = await Project.findById(id).populate({path:'tasks', populate:{path:'finishBy', select: "name"}}).populate("collaborators","name email _id");
        if(!proj){
            return res.json({msg:'Project not found', error:true});
        }
        if(proj.creator.toString() !== req.user._id.toString() && !proj.collaborators.some(c=>c._id.toString() === req.user._id.toString())){
            return res.json({msg:'Project not permitted', error:true});
        }
        return res.status(200).json(proj);
    }
    catch(error){
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const editProject = async (req, res) => {
    const {id}=req.params;
    const proj = await Project.findById(id);
    if(!proj){
        return res.json({msg:'Project not found', error:true});
    }
    if(proj.creator.toString() !== req.user._id.toString()){
        return res.json({msg:'Project not permitted', error:true});
    }

    proj.name = req.body.name || proj.name;
    proj.description = req.body.description || proj.description;
    proj.deadline = req.body.deadline || proj.deadline;
    proj.client = req.body.client || proj.client;

    try {
        const projUpdated = await proj.save();
        return res.status(200).json(projUpdated);
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const deleteProject = async (req, res) => {
    const {id}=req.params;
    const proj = await Project.findById(id);
    if(!proj){
        return res.json({msg:'Project not found', error:true});
    }
    if(proj.creator.toString() !== req.user._id.toString()){
        return res.json({msg:'Project not permitted', error:true});
    }

    try {
        await proj.deleteOne();
        return res.status(200).json({msg:'Project deleted'});
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const searchCollaborator = async (req, res) => {
    const { email } = (req.body);
    const user= await User.findOne({email}).select('_id name email');
    if(!user){
        return res.json({msg:'User not found', error:true});
    }
    return res.json(user);
};

const addCollaborator = async (req, res) => {
    const {id} = req.params;
    const {email} = req.body;
    try {
        const proj = await Project.findById(id);
        if(!proj){
            return res.json({msg:'Project not found', error:true});
        }
        if(proj.creator.toString() !== req.user._id.toString()){
            return res.json({msg:'Project not permitted', error:true});
        }

        const user= await User.findOne({email}).select('_id name email');
        if(!user){
            return res.json({msg:'User not found', error:true});
        }

        if(proj.creator.toString()=== user._id.toString()){
            return res.json({msg:'The project creator cannot be a collaborator', error:true});
        }

        if(proj.collaborators.includes(user._id)){
            return res.json({msg:'This user is already a collaborator', error:true});
        }

        proj.collaborators.push(user._id);
        await proj.save();
        return res.status(200).json({msg:'Collaborator added successfully'});
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

const deleteCollaborator = async (req, res) => {
    const {id} = req.params;
    try {
        const [id1,idCollab] = id.split('--&--');
        const proj = await Project.findById(id1);
        if(!proj){
            return res.json({msg:'Project not found', error:true});
        }
        if(proj.creator.toString() !== req.user._id.toString()){
            return res.json({msg:'Project not permitted', error:true});
        }

        proj.collaborators.pull(idCollab);
        await proj.save();
        return res.status(200).json({msg:'Collaborator deleted successfully'});
    } catch (error) {
        console.log(error);
        return res.json({msg:error.message, error:true});
    }
};

export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    searchCollaborator,
    addCollaborator,
    deleteCollaborator
  };