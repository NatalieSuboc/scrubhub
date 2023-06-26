const TaskSchema = mongoose.Schema({
    taskid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    difficulty: {
        type: Number,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    subtasks: {
        type: [String]
    },
    pointvalue: {
        type: Number,
        required: true,
    },
    time: {
        type: Number
    }
});

module.exports = mongoose.model("task", TaskSchema);