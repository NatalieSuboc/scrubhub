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

        // Proper JSON body error checking
        // Required fields: username and password
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ error: "Username and/or password not found"});
        }

        // If user doesn't exist, create new user id and upload to db
        const userid = uuidv4.uuidv4();

        // TODO: Upload info to existing APIs
        const username = req.body.username;
        const password = req.body.password;

        // Upload other User info to db
        const points = req.body.points ? req.body.points : 0;
        const email = req.body.email; // TODO proper email parsing

        try {
            // first check if a user already exists
            // TODO would check the username too once that's set up
            let user = await User.findOne({ userid });
            if (user) {
                return res.status(400).json({ message: "User already exists"});
            }

            user = new User({
                userid,
                points,
                email
            });
            await user.save();

            res.status(201).send({
                message: "User created",
                userid: userid,
            });
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in creating user");
        }
    })

    module.exports = router;