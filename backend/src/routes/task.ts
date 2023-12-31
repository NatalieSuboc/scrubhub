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
 * @param - /delete?taskid=<taskid>
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
            
            let deleted = await Task.deleteOne({ taskid: tid });
            return res.status(202).json({
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
 * @method - GET
 * @param - /get?taskid=<taskid>
 * @description - retrieves a task based on taskid
 */
router.get("/get", 
    function (req: Request, res: Response, next: NextFunction) {
        next();
    }, 
    async (req: Request, res: Response) => {
        // Error checking
        if (!req.query.taskid) {
            return res.status(400).json({ message: "No task ID specified" });
        }
        try {
            const task = await Task.findOne({taskid: req.query.taskid});
            res.status(200).json({
                task: {
                    taskid: task.taskid,
                    name: task.name,
                    description: task.description,
                    difficulty: task.difficulty,
                    userid: task.userid,
                    subtasks: task.subtasks,
                    pointvalue: task.pointvalue,
                    time: task.time
                }
            });
        } catch (e: any) {
            console.log(e);
            res.status(500).send("Error in fetching task");
        }
    }
);

/**
 * @method - PUT
 * @param - /update?taskid=<taskid>
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
        if(!(req.body.name || req.body.description || req.body.difficulty || req.body.subtasks || req.body.pointvalue || req.body.time)) {
            return res.status(400).json({ message: "No update parameter"});
        }
        const tid = req.query.taskid;
        try {
            let task = await Task.findOne({ taskid: tid });
            if (!task) {
                return res.status(400).json({ message: "Task does not exist"});
            }

            const updateBody = {
                name: req.body.name ? req.body.name : task.name,
                description: req.body.description ? req.body.description : task.description,
                difficulty: req.body.difficulty ? req.body.difficulty : task.difficulty,
                subtasks: req.body.subtasks ? req.body.subtasks : task.subtasks,
                pointvalue: req.body.pointvalue ? req.body.pointvalue : task.pointvalue,
                time: req.body.time ? req.body.time : task.time
            };
            let updated = await Task.updateOne({ taskid: tid }, updateBody);
            
            return res.status(200).json({
                message: "Task successfully updated",
                taskid: tid,
                acknowledged: updated.acknowledged
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in updating task");
        }
    }
);

/**
 * @method - GET
 * @param - /get-all?sortby=<sortby>&userid=<userid>
 * @description - fetches all tasks sorted by specified criteria,
 *  sortby criterion optional but userid required
 */
router.get("/get-all", 
    function (req: Request, res: Response, next: NextFunction) {
        next();
    },
    async (req: Request, res: Response) => {

        const CRITERIA = new Set(["name", "description", "pointvalue", 
            "time", "difficulty"]);

        const criterion = req.query.sortby;
        const userid = req.query.userid;

        if (!userid) {
            return res.status(400).json({ message: "user id not specified" });
        }
        // Check if userid is a valid userid
        let user = await User.findOne({ userid: userid });
        if (!user) {
            return res.status(400).json({ message: "User does not exist"});
        }
        // TODO Repetition in fetching from db, merge into one block
        if (!criterion) {
            // return all tasks identified with the user id
            try {
                const tasks = await Task.find({userid: userid});
                res.status(200).json({tasks: tasks});

            } catch (e: any) {
                console.log(e);
                res.status(500).send("Error in fetching tasks");
            }
        } else {
            // Checks if criterion passed in is a valid sort value
            const c = String(criterion).toLowerCase();
            if (CRITERIA.has(c)) {
                // Decided to encode as String and then deserialize to cut down on if statements
                // The '1' sorts as ascending / alphabetical
                const optionsStr = '{"' + c + '": 1}';
                const options = JSON.parse(optionsStr);
                try {
                    const tasks = await Task.find({userid: userid}).sort(options);
                    res.status(200).json({tasks: tasks});
                } catch (e: any) {
                    console.log(e);
                    res.status(500).send("Error in fetching tasks");
                }
            } else {
                return res.status(400).json({ message: "invalid sortby criterion"});
            }
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