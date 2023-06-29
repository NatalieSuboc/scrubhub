const userMongoose = require('mongoose');

// NOTE: Existing APIs already store the userid, username, and password
const UserSchema = userMongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
    },
    points: {
        type: Number,
        required: true,
        default: 0,
    },
    email: {
        type: String
    }
});

module.exports = userMongoose.model("user", UserSchema);