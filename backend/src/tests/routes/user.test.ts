const server = require('../../index');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const mCreateMongoServer = require('../../config/dbconfig');
const User = require('../../models/User');

// Need these two lines to mock our MongoDB connection - we want
// to return "mocked" data and not actually ping the db when we test
jest.mock('../../config/dbconfig');
const mockCreateMongoServer = jest.mocked(mCreateMongoServer);

// Dummy Test to check correct setup
describe('dummy test', () => {
    test('should pass without anything', () => {
        expect(0).toBe(0);
    });
});

describe('Create User API tests', () => {
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    afterAll((done) => {
        // Shut down server after all tests are done running
        server.appServer.close(done);
    });
    test('Create user test', async () => {
        // "Mocked" data and db
        const mockData = { username: "fakename", password: "password", points: 10, email: "email@email.com" };
        const mockDB = { query: jest.fn().mockResolvedValueOnce(mockData) };
        mockCreateMongoServer.mockResolvedValueOnce(mockDB);

        // Usually these functions have a different implementation, but for testing purposes
        // they've been modified to return certain values
        User.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("1");
        User.prototype.save = jest.fn().mockImplementation(() => {});
        
        // Equivalent of calling http://localhost:4000/user/create
        const response = await request(server.app).post('/user/create').send(mockData);
        expect(response.status).toEqual(201);
        expect(response.body.userid).toEqual("1"); // mocked userid value
        expect(response.body.message).toEqual("User created");
    });

});

module.exports = {};