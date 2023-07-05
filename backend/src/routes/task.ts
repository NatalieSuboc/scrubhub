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
        const subtasks = req.body.subtasks ? req.body.subtasks : 0;
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
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in creating task");
        }
    })

    module.exports = router;