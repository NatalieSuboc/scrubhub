import { NextFunction, Request, Response } from 'express';

const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');

const middlewareFunc = function (req: Request, res: Response, next: NextFunction) {
    next();
};

/**
 * @method - POST
 * @param - /create
 * @description - creates a new user
 */
router.post("/create", 
    // TODO Create proper middleware function, placeholder here to pass parameter check
    middlewareFunc,
    async (req: Request, res: Response) => {

        // Proper JSON body error checking
        // Required fields: username and password
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ error: "Username and/or password not found"});
        }

        // If user doesn't exist, create new user id and upload to db
        const userid = uuidv4();

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
                return res.status(400).json({ message: "User alerady exists"});
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
    }
);

/**
 * @method - GET
 * @param - /get?userid=<userid>
 * @description - retrieves a user based on userid
 */
router.get("/get", middlewareFunc, 
    async (req: Request, res: Response) => {
        // Error checking
        if (!req.query.userid) {
            return res.status(400).json({ message: "No user ID specified" });
        }
        try {
            const user = await User.findOne({userid: req.query.userid});
            res.status(200).json({
                user: {
                    userid: user.userid,
                    points: user.points,
                    email: user.email
                }
            });
        } catch (e: any) {
            console.log(e);
            res.status(500).send("Error in fetching user");
        }
    }
);

/**
 * @method - PUT
 * @param - /update?userid=<userid>
 * @description - updates a user based on userid
 */
router.put("/update", middlewareFunc,
    async (req: Request, res: Response) => {
        // Error checking
        if (!req.query.userid) {
            return res.status(400).json({ message: "No user ID specified" });
        }
        if (!req.body) {
            return res.status(400).json({ message: "No fields specified to update"});
        }

        try {
            const response = await User.updateOne({ userid: req.query.userid }, req.body);
            res.status(200).json(response);
        } catch (e: any) {
            console.log(e);
            res.status(500).send("Error in fetching user");
        }
    }
);

module.exports = router;