export {}
const server = require('../../index');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mCreateMongoServer = require('../../config/dbconfig');
const User = require('../../models/User');

// Need these two lines to mock our MongoDB connection - we want
// to return "mocked" data and not actually ping the db when we test
jest.mock('../../config/dbconfig');
const mockCreateMongoServer = jest.mocked(mCreateMongoServer);

// Helpful constants used in multiple tests
const MOCK_USER_DATA = { username: "fakename", password: "password", userid: "1", points: 10, email: "email@email.com" };
const MOCK_USER = new User(MOCK_USER_DATA);

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
        expect(Object.keys(copy).length).toBe(3);
        expect(copy["points"]).toBe(10);
        expect(copy["email"]).toBe("email@email.com");

        // Checks if original is unaltered
        expect(Object.keys(MOCK_USER_DATA).length).toBe(5);
        expect(MOCK_USER_DATA["username"]).toBe("fakename");
        expect(MOCK_USER_DATA["password"]).toBe("password");
    });
});

describe('Create User API tests', () => {
    beforeEach(() => {
        // TODO Might not need this
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

describe('Sign in user API tests', () => {
    beforeEach(() => {
        // Note: This is the same setup for create user testing, but after user
        // creation we have to change some of the mocks since signing in is different 
        // Note 2: Is this too vague??
        User.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("1");
        User.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    test('Sign in user test', async() => {
        // First need to create a user before testing their sign in
        const createUserResponse = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(createUserResponse.status).toEqual(201);

        // Mocks are changed here to test the signin now
        User.findOne = jest.fn().mockReturnValueOnce(MOCK_USER);
        const data = removeKeysFromDict(MOCK_USER_DATA, ["points", "email"]);
        // Does a direct equality check since the hashed + salted password does not end up being stored in the db
        bcrypt.compare = jest.fn().mockReturnValueOnce(MOCK_USER_DATA.password == data.password);

        const response = await request(server.app).post('/user/signin').send(data);
        expect(response.status).toEqual(200);
        expect(response.body.userid).toEqual("1");
        expect(response.body.token).toBeTruthy(); // Checks for token's presence
    });
    test('Sign in user incorrect password test', async() => {
        // Create user
        const createUserResponse = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(createUserResponse.status).toEqual(201);

        // Sign in user
        User.findOne = jest.fn().mockReturnValueOnce(MOCK_USER);
        const data = removeKeysFromDict(MOCK_USER_DATA, ["points", "email"]);
        data["password"] = "bad password";
        bcrypt.compare = jest.fn().mockReturnValueOnce(MOCK_USER_DATA.password == data.password);

        const response = await request(server.app).post('/user/signin').send(data);
        expect(response.status).toEqual(400);
    });
});

describe('Get user API tests', () => {
    beforeEach(() => {
        User.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("1");
        User.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    test('Get user test', async() => {
        // Create user
        const createUserResponse = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(createUserResponse.status).toEqual(201);
        // Sign in user
        User.findOne = jest.fn().mockReturnValue(MOCK_USER);
        const data = removeKeysFromDict(MOCK_USER_DATA, ["points", "email"]);
        bcrypt.compare = jest.fn().mockReturnValueOnce(MOCK_USER_DATA.password == data.password);
        const signinUserResponse = await request(server.app).post('/user/signin').send(data);
        expect(signinUserResponse.status).toEqual(200);
        expect(signinUserResponse.body.token).toBeTruthy();
        // Get user
        const token = signinUserResponse.body.token;
        const userid = signinUserResponse.body.userid;
        const response = await request(server.app).get(`/user/get?userid=${userid}`).set('token', token);

        expect(response.status).toEqual(200);
        expect(response.body.user.userid).toBe("1");
        expect(response.body.user.username).toBe("fakename");
        // I got too lazy to do the rest of the fields, sorry!
    });
    test('Get user without signing in test', async() => {
        // Create user
        const createUserResponse = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(createUserResponse.status).toEqual(201);
        // Get user
        const token = null;
        const userid = createUserResponse.body.userid;
        // Invalid token
        const response = await request(server.app).get(`/user/get?userid=${userid}`).set('token', token);
        expect(response.status).toEqual(500);
        // No token
        const response2 = await request(server.app).get(`/user/get?userid=${userid}`);
        expect(response2.status).toEqual(401);
    });
    test('Get user and signed in but incorrect token test', async() => {
        // Create user
        const createUserResponse = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(createUserResponse.status).toEqual(201);
        // Sign in user
        User.findOne = jest.fn().mockReturnValue(MOCK_USER);
        const data = removeKeysFromDict(MOCK_USER_DATA, ["points", "email"]);
        bcrypt.compare = jest.fn().mockReturnValueOnce(MOCK_USER_DATA.password == data.password);
        const signinUserResponse = await request(server.app).post('/user/signin').send(data);
        expect(signinUserResponse.status).toEqual(200);
        expect(signinUserResponse.body.token).toBeTruthy();
        // Get user
        const token = "incorrect token";
        const userid = createUserResponse.body.userid;
        // Invalid token
        const response = await request(server.app).get(`/user/get?userid=${userid}`).set('token', token);
        expect(response.status).toEqual(500);
    });
});

describe('Update user API tests', () => {
    beforeEach(() => {
        User.findOne = jest.fn().mockReturnValueOnce(null);
        uuidv4.uuidv4 = jest.fn().mockReturnValue("1");
        User.prototype.save = jest.fn().mockImplementation(() => {});
    });
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });
    test('Update user test', async() => {
        // Setup - create and sign-in user
        // Create user
        const createUserResponse = await request(server.app).post('/user/create').send(MOCK_USER_DATA);
        expect(createUserResponse.status).toEqual(201);
        // Sign in user
        User.findOne = jest.fn().mockReturnValue(MOCK_USER);
        const data = removeKeysFromDict(MOCK_USER_DATA, ["points", "email"]);
        bcrypt.compare = jest.fn().mockReturnValueOnce(MOCK_USER_DATA.password == data.password);
        const signinUserResponse = await request(server.app).post('/user/signin').send(data);
        expect(signinUserResponse.status).toEqual(200);
        expect(signinUserResponse.body.token).toBeTruthy();
        // Update fields
        const updateFields = { username: "username2", points: 10 };
        const updatedUserData = {
            username: updateFields.username, 
            password: MOCK_USER.password,
            points: updateFields.points,
            email: MOCK_USER.email,
        };
        User.updateOne = jest.fn().mockReturnValue({acknowledged: true});
        const userid = createUserResponse.body.userid;
        const token = signinUserResponse.body.token;
        const updateUserResponse = await request(server.app).put(`/user/update?userid=${userid}`)
            .set('token', token).send(updatedUserData);
        console.log(updateUserResponse);
        expect(updateUserResponse.status).toEqual(200);
        expect(updateUserResponse.body.acknowledged).toEqual(true);

    });
    test('Update user without signin in test', async() => {

    });
    test('Update user without any changes test', async() => {

    });
    test('Update user and signed in but incorrect token test', async() => {

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