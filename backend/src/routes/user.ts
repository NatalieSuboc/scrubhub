import { NextFunction, Request, Response } from 'express';

const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');

const SECRET = "scrubhub";

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
        const userid = uuidv4.uuidv4();

        // Upload User info to db
        const username = req.body.username;
        // Encrypt password
        let password = req.body.password;
        const salt = await bcrypt.genSalt(15);
        password = await bcrypt.hash(password, salt);
        
        const points = req.body.points ? req.body.points : 0;
        const email = req.body.email; // TODO proper email parsing

        try {
            // first check if a user already exists
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ message: "User already exists"});
            }

            user = new User({ userid, username, password, points, email });
            await user.save();

            // Authentication of user - signs the user's token
            const userPayload = { userid: userid, username: username };
            jwt.sign(userPayload, SECRET, { expiresIn: 100000 /* Basically never */ },
                (error: any, token: String) => {
                    if (error) {
                        throw error; // Will be caught and return "Error in creating user"
                    }
                    res.status(201).send({
                        message: "User created",
                        userid: userid,
                        token: token,
                    });
                }
            );

        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Error in creating user");
        }
    }
);

/**
 * @method - POST
 * @param - /signin
 * @description - authenticates ("signs in") a user
 */
router.post("/signin", middlewareFunc, 
    async (req: Request, res: Response) => {

        try {
            let user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            // Here's the hard part
            // Compares the plaintext password (first parameter) with the encrypted password
            // from the db (second parameter) - SHOULD return true if the plaintext is correct
            const matches = await bcrypt.compare(req.body.password, user.password);
            if (!matches) {
                return res.status(400).json({ message: "Incorrect password"});
            }
            const userPayload = { userid: user.userid, username: user.username };
            jwt.sign(userPayload, SECRET, { expiresIn: 100000 /* Basically never */ },
            (error: any, token: String) => {
                if (error) {
                    throw error; // Will be caught and return "Internal error in user signin"
                }
                res.status(200).send({
                    message: "User signed in",
                    userid: user.userid,
                    token: token,
                });
            }
        );
        } catch (e: any) {
            console.log(e.message);
            res.status(500).send("Internal error in user signin");
        }
    }
);

/**
 * @method - GET
 * @param - /get?userid=<userid>
 * @description - retrieves a user based on userid
 */
router.get("/get", auth, 
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
                    username: user.username,
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
router.put("/update", auth,
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