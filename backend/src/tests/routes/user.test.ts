const server = require('../../index');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const mCreateMongoServer = require('../../config/dbconfig');
const User = require('../../models/User');
const axios = require('axios');
const BACKEND_PORT = 4000;

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
        server.appServer.close(done);
    });
    test('Create user test', async () => {
        const mockData = { username: "fakename", password: "password", points: 10, email: "email@email.com" };
        const mockDB = { query: jest.fn().mockResolvedValueOnce(mockData) };
        mockCreateMongoServer.mockResolvedValueOnce(mockDB);

        User.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("1");
        User.prototype.save = jest.fn().mockImplementation(() => {});
        
        const response = await request(server.app).post('/user/create').send(mockData);
        expect(response.status).toEqual(201);
        expect(response.body.userid).toEqual("1");
        expect(response.body.message).toEqual("User created");
    });


});

module.exports = {};