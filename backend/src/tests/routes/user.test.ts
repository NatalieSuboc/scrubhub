const server = require('../../index');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const mCreateMongoServer = require('../../config/dbconfig');
const User = require('../../models/User');

// Need these two lines to mock our MongoDB connection - we want
// to return "mocked" data and not actually ping the db when we test
jest.mock('../../config/dbconfig');
const mockCreateMongoServer = jest.mocked(mCreateMongoServer);

// Helpful constants used in multiple tests
const MOCK_USER_DATA = { username: "fakename", password: "password", points: 10, email: "email@email.com" };

// Helper functions
/**
 * @method - removeKeysFromDict
 * @param - dict: dictionary of Strings
 * @param - keysToDelete: list of keys we want deleted from dict
 * @description - returns a copy of the dict after removing the keys without altering the original
 */
function removeKeysFromDict(dict : {[key : string]: any}, keysToDelete : string[]) {
    let copy = Object.assign({}, dict); // No offense to JS but this is so unintuitive
    keysToDelete.forEach((key) => { delete copy[key]; });
    return copy;
}

// Dummy Test to check correct setup
describe('dummy test', () => {
    test('should pass without anything', () => {
        expect(0).toBe(0);
    });
});

describe('Helper function tests', () => {
    test('delete keys test', () => {
        const keysToDelete = ["username", "password"];
        const copy = removeKeysFromDict(MOCK_USER_DATA, keysToDelete);

        // Checks if copy is correct
        expect(Object.keys(copy).length).toBe(2);
        expect(copy["points"]).toBe(10);
        expect(copy["email"]).toBe("email@email.com");

        // Checks if original is unaltered
        expect(Object.keys(MOCK_USER_DATA).length).toBe(4);
        expect(MOCK_USER_DATA["username"]).toBe("fakename");
        expect(MOCK_USER_DATA["password"]).toBe("password");
    });
});

describe('Create User API tests', () => {
    beforeEach(() => {
        // "Mocked" data and db
        const mockDB = { query: jest.fn().mockResolvedValueOnce(MOCK_USER_DATA) };
        mockCreateMongoServer.mockResolvedValueOnce(mockDB);

        // Usually these functions have a different implementation, but for testing purposes
        // they've been modified to return certain values
        User.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("1");
        User.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    afterAll((done) => {
        // Shut down server after all tests are done running
        server.appServer.close(done);
    });
    test('Create user test', async () => {
        // Equivalent of calling http://localhost:4000/user/create
        const response = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(response.status).toEqual(201);
        expect(response.body.userid).toEqual("1"); // mocked userid value
        expect(response.body.message).toEqual("User created");
    });
    test('Create user with no username given test', async () => {
        const data = removeKeysFromDict(MOCK_USER_DATA, ["username"]);
        const response = await request(server.app).post('/user/create').send(data);
        expect(response.status).toEqual(400);

    });
    test('Create user with no password given test', async () => {
        const data = removeKeysFromDict(MOCK_USER_DATA, ["password"]);
        const response = await request(server.app).post('/user/create').send(data);
        expect(response.status).toEqual(400);
    });

});

module.exports = {};