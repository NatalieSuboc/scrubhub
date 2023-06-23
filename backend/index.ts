// NOTE: Doesn't work yet, just some boilerplate JS
declare function require(name:string);

const express = require('express');

const app = express();
// app.use(cors());

const PORT = 4000; // Runs on PORT 4000

app.listen(PORT, (req, res) => {
    console.log(`Server started at port ${PORT}`);
})