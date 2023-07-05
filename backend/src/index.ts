const express = require('express');
const initMongoServer = require('./config/dbconfig');
const user = require('./routes/user');
const task = require('./routes/task');
const cors = require('cors');
const bodyParser = require('body-parser');


initMongoServer(); // Turns on MongoDB server and connects to it

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", user);
app.use("/task", task);

const PORT = 4000; // Runs on PORT 4000

app.listen(PORT, (req: Express.Request, res: Express.Response) => {
    console.log(`Server started at port ${PORT}`);
})