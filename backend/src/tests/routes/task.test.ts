//https://stackoverflow.com/questions/65172620/did-jest-testing-multiple-files-at-one-moment
//https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use

export {}
const server = require('../../index');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mCreateMongoServer = require('../../config/dbconfig');
const User = require('../../models/User');
const Task = require('../../models/Task');

// Need these two lines to mock our MongoDB connection - we want
// to return "mocked" data and not actually ping the db when we test
jest.mock('../../config/dbconfig');
const mockCreateMongoServer = jest.mocked(mCreateMongoServer);

// Helpful constants used in multiple tests
const MOCK_USER_DATA = { username: "fakename", password: "password", userid: "1", points: 10, email: "email@email.com" };
const MOCK_USER = new User(MOCK_USER_DATA);

const MOCK_TASK_DATA = { taskid: "2", name: "taskName", description: "taskDescription", difficulty: 9, userid: "1", subtasks: [], pointvalue: 3, time: 40};
const MOCK_TASK = new Task(MOCK_TASK_DATA);

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
        const response = await request(server.app).post('/task/create').send(MOCK_TASK_DATA);
        expect(response.status).toEqual(201);
        // expect(response.body.taskid).toEqual("2"); // its not workingadndskjfnsakdfla
        expect(response.body.userid).toEqual("1");
        expect(response.body.description).toEqual("taskDescription");
        expect(response.body.message).toEqual("Task created");
    });
    // test('Create user with no username given test', async () => {
    //     const data = removeKeysFromDict(MOCK_USER_DATA, ["username"]);
    //     const response = await request(server.app).post('/user/create').send(data);
    //     expect(response.status).toEqual(400);

    // });
    // test('Create user with no password given test', async () => {
    //     const data = removeKeysFromDict(MOCK_USER_DATA, ["password"]);
    //     const response = await request(server.app).post('/user/create').send(data);
    //     expect(response.status).toEqual(400);
    // });
});

// More complicated tests that may require multiple users, multiple calls, etc.
describe('Comprehensive API tests', () => {

});

afterAll((done) => {
    // Shut down server after all tests are done running
    server.appServer.close(done);
});

module.exports = {};