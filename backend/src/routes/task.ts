import { NextFunction, Request, Response } from 'express';

const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');

/**
 * @method - POST
 * @param - /create
 * @description - creates a new user
 */
router.post("/create", 
    // TODO Create proper middleware function, placeholder here to pass parameter check
    function (req: Request, res: Response, next: NextFunction) {
        next();
    },
    async (req: Request, res: Response) => {

        //Check if a userid is passed in
        if(!req.body.userid){
            return res.status(400).json({ error: "User not found"});
        }

        // If task doesn't exist, create new task id and upload to db
        const taskid = uuidv4();

        // Upload other task info to db
        const name = req.body.name ? req.body.name : "untitled";
        const description = req.body.description ? req.body.description : "";
        const difficulty = req.body.difficulty ? req.body.difficulty : 0;
        const userid = req.body.userid;
        const subtasks = req.body.subtasks ? req.body.subtasks : [];
        const pointvalue = req.body.pointvalue ? req.body.pointvalue : 0;
        const time = req.body.time ? req.body.time : 0;

        try {
            // first check if a user already exists
            // TODO would check the username too once that's set up
            let task = await Task.findOne({ taskid });
            if (task) {
                return res.status(400).json({ message: "Task already exists"});
            }

            task = new Task({
                taskid,
                name,
                description,
                difficulty,
                userid,
                subtasks,
                pointvalue,
                time
            });
            await task.save();

            res.status(201).send({
                message: "Task created",
                taskid: taskid,
                name: name,
                description: description,
                difficulty: difficulty,
                userid: userid,
                subtasks: subtasks,
                pointvalue: pointvalue,
                time: time
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in creating task");
        }
    });

/**
 * @method - DELETE
 * @param - /delete
 * @description - deletes the specified task
 */
router.delete("/delete",
    function (req: Request, res: Response, next: NextFunction) {
        next();
    },
    async (req: Request, res: Response) => {
        // Error checking
        if (!req.query.taskid) {
            return res.status(400).json({ error: "Task id not found"});
        }

        const tid = req.query.taskid;
        try {
            let task = await Task.findOne({ taskid: tid });
            if (!task) {
                return res.status(400).json({ message: "Task does not exist"});
            }
            
            let deleted = Task.deleteOne({ taskid: tid });
            return res.status(204).json({
                message: "Task successfully deleted",
                taskid: tid,
                acknowledged: deleted.acknowledged
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in deleting task");
        }
    }
);

/**
 * @method - PUT
 * @param - /update
 * @description - updates task
 */

router.put("/update",
    function (req: Request, res: Response, next: NextFunction){
        next();
    },
    async (req: Request, res: Response) => {
        if(!req.query.taskid) {
            return res.status(400).json({ message: "Task does not exist"});
        }
        if(!(req.query.name || req.query.description || req.query.difficulty || req.query.subtasks || req.query.pointvalue || req.query.time)) {
            return res.status(400).json({ message: "No update parameter"});
        }
        const tid = req.query.taskid;
        try {
            let task = await Task.findOne({ taskid: tid });
            if (!task) {
                return res.status(400).json({ message: "Task does not exist"});
            }

            let updated = Task.updateOne({ 
                taskid: tid, 
                name: req.body.name ? req.body.name : task.body.name,
                description: req.body.description ? req.body.description : task.body.description,
                difficulty: req.body.difficulty ? req.body.difficulty : task.body.difficulty,
                subtasks: req.body.subtasks ? req.body.subtasks : task.body.subtasks,
                pointvalue: req.body.pointvalue ? req.body.pointvalue : task.body.pointvalue,
                time: req.body.time ? req.body.time : task.body.time
            });
            
            return res.status(200).json({
                message: "Task successfully updated",
                taskid: tid,
                name: updated.name,
                description: updated.description,
                difficulty: updated.difficulty,
                subtasks: updated.subtasks,
                pointvalue: updated.pointvalue,
                time: updated.time
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in deleting task");
        }
    }
);
module.exports = router;

// taskid,
// name,
// description,
// difficulty,
// userid,
// subtasks,
// pointvalue,
// time