const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://scrubhub:<password>@cluster0.ok4rprp.mongodb.net/?retryWrites=true&w=majority"; // URI will go here when we set it up

const CreateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
        });
        console.log("Successful DB connection!");
    } catch (e)  {
        console.log(e);
        throw e;
    }
}

module.exports = CreateMongoServer;