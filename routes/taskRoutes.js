import express from "express";
import {
    getTask,
    newTask,
    editTask,
    deleteTask,
    setState
 } from "../controllers/taskController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, newTask)
router.route("/:id").get(checkAuth, getTask).put(checkAuth, editTask).delete(checkAuth, deleteTask);

router.post("/state/:id", checkAuth, setState);

export default router;