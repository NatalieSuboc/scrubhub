const express = require('express');

const app = express();
// app.use(cors());

const PORT = 4000; // Runs on PORT 4000

app.listen(PORT, (req: Express.Request, res: Express.Response) => {
    console.log(`Server started at port ${PORT}`);
})