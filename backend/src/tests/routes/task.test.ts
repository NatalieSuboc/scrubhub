export {}
const server = require('../../index');
const request = require('supertest');
// const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mCreateMongoServer = require('../../config/dbconfig');
// const User = require('../../models/User');
const Task = require('../../models/Task');

// Need these two lines to mock our MongoDB connection - we want
// to return "mocked" data and not actually ping the db when we test
jest.mock('../../config/dbconfig');
const mockCreateMongoServer = jest.mocked(mCreateMongoServer);

// Helpful constants used in multiple tests
// const MOCK_USER_DATA = { username: "fakename", password: "password", userid: "1", points: 10, email: "email@email.com" };
// const MOCK_USER = new User(MOCK_USER_DATA);

const MOCK_TASK_DATA = { taskid: "2", name: "taskName", description: "taskDescription", difficulty: 9, userid: "1", subtasks: [], pointvalue: 3, time: 40};
const MOCK_TASK_DATA2 = { taskid: "2", name: "newName", description: "taskDescription", difficulty: 9, userid: "1", subtasks: [], pointvalue: 3, time: 40};
const MOCK_TASK = new Task(MOCK_TASK_DATA);
const MOCK_TASK2 = new Task(MOCK_TASK_DATA);

// Helper functions
/**
 * @method - removeKeysFromDict
 * @param - dict: dictionary of Strings
 * @param - keysToDelete: list of keys we want deleted from dict
 * @description - returns a copy of the dict after removing the keys without altering the original
 */
function removeKeysFromDict2(dict : {[key : string]: any}, keysToDelete : string[]) {
    let copy = Object.assign({}, dict); // No offense to JS but this is so unintuitive
    keysToDelete.forEach((key) => { delete copy[key]; });
    return copy;
}

describe('dummy test', () => {
    test('should pass without anything', () => {
        expect(0).toBe(0);
    });
});

describe('Helper function tests', () => {
    test('delete keys test 2', () => {
        const keysToDelete = ["name", "description"];
        const copy = removeKeysFromDict2(MOCK_TASK_DATA, keysToDelete);

        // Checks if copy is correct
        expect(Object.keys(copy).length).toBe(6);
        expect(copy["taskid"]).toBe("2");
        expect(copy["difficulty"]).toBe(9);
        expect(copy["userid"]).toBe("1");
        expect(copy["subtasks"]).toStrictEqual([]);
        expect(copy["pointvalue"]).toBe(3);
        expect(copy["time"]).toBe(40);

        // Checks if original is unaltered
        expect(Object.keys(MOCK_TASK_DATA).length).toBe(8);
        expect(MOCK_TASK_DATA["name"]).toBe("taskName");
        expect(MOCK_TASK_DATA["description"]).toBe("taskDescription");
    });
});

describe('Create Task API tests', () => {
    beforeEach(() => {
        // TODO Might not need this
        // "Mocked" data and db
        const mockDB = { query: jest.fn().mockResolvedValueOnce(MOCK_TASK_DATA) };
        mockCreateMongoServer.mockResolvedValueOnce(mockDB);

        // Usually these functions have a different implementation, but for testing purposes
        // they've been modified to return certain values
        Task.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("2");
        Task.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    test('Create task test', async () => {
        // Equivalent of calling http://localhost:4000/user/create
        //const temp = await request(server.app).post('/task/create').send(MOCK_USER_DATA);
        const response = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(response.status).toEqual(201);

        expect(response.body.userid).toEqual("1");
        expect(response.body.description).toEqual("taskDescription");
        expect(response.body.message).toEqual("Task created");
    });
    test('Create task with no userid given test', async () => {
        const data = removeKeysFromDict2(MOCK_TASK_DATA, ["userid"]);
        const response = await request(server.app).post('/task/create').send(data);
        expect(response.status).toEqual(400);
    });
});

//Need to test no matching taskid
describe('Get task API tests', () => {
    beforeEach(() => {
        Task.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("2");
        Task.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    test('Get task test', async() => {
        // Create task
        const createTaskResponse = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(createTaskResponse.status).toEqual(201);

        
        Task.findOne = jest.fn().mockReturnValue(MOCK_TASK);
        const taskid = createTaskResponse.body.taskid;
        // console.log(taskid);
        const response = await request(server.app).get(`/task/get?taskid=${taskid}`);

        //Check fields to be the corrrect task
        expect(response.status).toEqual(200);
        expect(response.body.task.taskid).toBe("2");
        expect(response.body.task.name).toBe("taskName");
        expect(response.body.task.description).toBe("taskDescription");
        expect(response.body.task.difficulty).toBe(9);
        expect(response.body.task.userid).toBe("1");
        expect(response.body.task.subtasks).toHaveLength(0);
        expect(response.body.task.pointvalue).toBe(3);
        expect(response.body.task.time).toBe(40);        
    });
    test('Get task without taskid given test', async() => {
        const createTaskResponse = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(createTaskResponse.status).toEqual(201);

        // const taskid = null;
        Task.findOne = jest.fn().mockReturnValue(MOCK_TASK);
        const response = await request(server.app).get(`/task/get`);
        expect(response.status).toEqual(400);
    });
    test('Get task with error in taskid', async() =>{
        const createTaskResponse = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(createTaskResponse.status).toEqual(201);

        Task.findOne = jest.fn(() => { throw new Error("message"); });
        const taskid = "3";
        const response = await request(server.app).get(`/task/get?taskid=${taskid}`);
        expect(response.status).toEqual(500);
    });
    test('Get all tasks', async() =>{

    });
});

describe('Update task API tests', () => {
    beforeEach(() => {
        Task.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("2");
        Task.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    test('Update task test', async() => {
        const createTaskResponse = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(createTaskResponse.status).toEqual(201);

        const taskChanges = {
            name: "newName"
        }

        Task.updateOne = jest.fn().mockReturnValue({ acknowledged: true });
        Task.findOne = jest.fn().mockReturnValue(MOCK_TASK);
        const taskid = createTaskResponse.body.taskid;

        const taskUpdate = await request(server.app).put(`/task/update?taskid=${taskid}`).send(taskChanges);
        expect(taskUpdate.status).toEqual(200);
        
        Task.findOne = jest.fn().mockReturnValue(MOCK_TASK2);
        const response = await request(server.app).get(`/task/get?taskid=${taskid}`);
        expect(response.status).toEqual(200);

        // expect(response.body.name).toBe("newName");
    });
    test('Update but no update parameter test',  async() => {
        const createTaskResponse = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(createTaskResponse.status).toEqual(201);

        Task.findOne = jest.fn().mockReturnValue(MOCK_TASK);
        const taskid = createTaskResponse.body.taskid;

        const taskUpdate = await request(server.app).put(`/task/update?taskid=${taskid}`).send({});
        expect(taskUpdate.status).toEqual(400);
        expect(taskUpdate.body.message).toEqual("No update parameter");
    });
});

// More complicated tests that may require multiple users, multiple calls, etc.
describe('Comprehensive API tests', () => {

});

afterAll((done) => {
    // Shut down server after all tests are done running
    server.appServer.close(done);
});

module.exports = {};


//Issues
/*
File issues in case you run into the same things:
Issue 1: Global variables declared elsewhere so then they can't de defined here
    Tried:
        Renaming the variables -> one of the variables is the server, so thought there was an issue of having two instances + also not sure if there was an issue with keywords
            -> Note: I find out later that it should have solved it + and the issues were from something else
        Not re-declaring any of the variables -> variable not declared and so can't access server
        Only redeclaring specific variables with different names -> need most if not all of the variables
    Solution:
        Changing it to an export file by adding "export {}" at the top as import/export files automatically scope variables as it gets treated as a module
    Sources:
        https://stackoverflow.com/questions/64034534/why-does-typescript-cannot-redeclare-block-scoped-variable
        https://codingbeautydev.com/blog/typescript-cannot-redeclare-block-scoped-variable/

Issue 2: Port already in use (Whenever I tried to run task tests, it says that Port:4000 is already in use)
    Tried: 
        Stopping the server at the beginning of the file with server.appServer.close(done); and server.appServer.clos();
        Looked into putting it all into one file, which people said worked, but its kind of ugly
        Tried to use a different port for these tests
    Solution:
        Turns out Jest runs these in parallel so when multiple files are accessing the same port,conflicts happen
        The solution is adding --max-workers=1 in the package.json file
        It was also throwing me off because the terminal says "Server started at port 4000" after the error message "listen EADDRINUSE: address already in use :::4000", but before the user tests
    Sources:
        https://stackoverflow.com/questions/65172620/did-jest-testing-multiple-files-at-one-moment
        https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
        https://levelup.gitconnected.com/how-to-kill-server-when-seeing-eaddrinuse-address-already-in-use-16c4c4d7fe5d

Issue 3: The taskid of the newly created task was a legit id instead of the mock one
    Tried: 
        squinting for typos, going back between the task.test.ts, user.test.ts, Task.ts, and task.ts pages
        What was really funny was that everything else was correct.
        Googling for how to do express api jest tests: https://www.makeuseof.com/express-apis-jest-test/  <- this ones pretty good
    Solution:
        In file task.ts, line 29 needed uuidv4() to be uuidv4.uuidv4(); -> it was returning the wrong thing the entire time
    Sources:
        @NatalieSuboc

Issue 4: The response from the api call for get is undefined
    Tried: 
        Lotta googling -> but difficult to figure out what to google
        Trying to get it to print response to the API call, which is how I knew it was undefined
        console.logs
        Comparing with other files
    Solution:
        Adding the line "Task.findOne = jest.fn().mockReturnValue(MOCK_TASK);"
        I still don't really know why we need it, but it works, so im not going to touch it. -> I am going to assume it might set TASK as the sample task
            -> But this reasoning is still iffy cause im not sure
    Sources:
        Looking at the user.test.ts file and trying to figure out why that is even necessary since it wasn't necessary to return a "2" for teaskid.
        https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/

*/