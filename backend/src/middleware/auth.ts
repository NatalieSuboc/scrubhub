import { NextFunction, Request, Response } from 'express';
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');

module.exports = function (req: Request, res: Response, next: NextFunction) {
    // Requires a token to be put in the header of the api req
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ message: "authentication error"});
    }
    try {
        // "scrubhub" is a randomly chosen string
        const verified = jwt.verify(token, "scrubhub");
        // req.body = verified.body;
        // NextFunction signals the auth's completion
        next();

    } catch (e: any) {
        console.log(e);
        res.status(500).send({ message: "invalid token" });
    }
}