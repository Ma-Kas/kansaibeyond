import request from 'supertest';
import app from '../app';

const baseUser = {
  username: 'testuser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'testy@test.com',
  displayName: 'the tester',
  password: 'testPassword',
};

describe('creating a new user', () => {
  test('succeeds with valid user data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(baseUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.username).toEqual(baseUser.username);
    expect(response.body.firstName).toEqual(baseUser.firstName);
  });

  test('fails with 400 with invalid user data format', async () => {
    const newUser = {
      username: 'testuser2',
      firstName: 2,
      lastName: 'McTester',
      email: 'testy@test.com',
      displayName: 'the tester',
      password: 'testPassword',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "firstName"',
        },
      ],
    });
  });

  test('fails with 400 on already existing username', async () => {
    const newUser = {
      username: 'testuser',
      firstName: 'testy',
      lastName: 'McTester',
      email: 'testy@test.com',
      displayName: 'the tester',
      password: 'testPassword',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'SequelizeUniqueConstraintError: username must be unique',
        },
      ],
    });
  });
});

describe('getting user data', () => {
  test('without params returns all users as json', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });

  test('with valid username as param returns specific user', async () => {
    const response = await request(app)
      .get('/api/users/testuser')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('testuser');
    expect(response.body).toHaveProperty('contact');
  });

  test('with non-existing username as param returns 404', async () => {
    const response = await request(app)
      .get('/api/users/testuser17')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'User not found.' }],
    });
  });
});

describe('updating user data', () => {
  // Delete the changed baseUser and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/users/testuser?force=true');
    // prettier-ignore
    await request(app)
      .post('/api/users')
      .send(baseUser);
  });

  test('succeeds with valid update data on existing user', async () => {
    const updateData = { displayName: 'changedTestUser' };

    const response = await request(app)
      .put('/api/users/testuser')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.displayName).toEqual(updateData.displayName);
  });

  test('returns 204 with empty update data on existing user', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/users/testuser')
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing user', async () => {
    const updateData = { username: 400 };

    const response = await request(app)
      .put('/api/users/testuser')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "username"',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing user', async () => {
    const updateData = { username: 'changedTestUser' };

    const response = await request(app)
      .put('/api/users/nonexisting')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'User to update was not found.' }],
    });
  });

  describe('related to associated contact table', () => {
    test('succeeds with valid contact update data', async () => {
      const preUpdateResponse = await request(app)
        .get('/api/users/testuser')
        .expect('Content-Type', /application\/json/);
      expect(preUpdateResponse.status).toEqual(200);
      expect(preUpdateResponse.body).toHaveProperty('contact');
      expect(preUpdateResponse.body.contact.twitter).toBeNull();

      const updateData = {
        displayName: 'changedTestUser',
        contact: { twitter: 'http://twittery.com' },
      };

      const response = await request(app)
        .put('/api/users/testuser')
        .send(updateData)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(200);
      expect(response.body.displayName).toEqual(updateData.displayName);

      const postUpdateResponse = await request(app)
        .get('/api/users/testuser')
        .expect('Content-Type', /application\/json/);
      expect(postUpdateResponse.status).toEqual(200);
      expect(postUpdateResponse.body).toHaveProperty('contact');
      expect(postUpdateResponse.body.contact.twitter).toEqual(
        updateData.contact.twitter
      );
    });

    test('fails with 400 with invalid contact update data', async () => {
      const preUpdateResponse = await request(app)
        .get('/api/users/testuser')
        .expect('Content-Type', /application\/json/);
      expect(preUpdateResponse.status).toEqual(200);
      expect(preUpdateResponse.body).toHaveProperty('contact');
      expect(preUpdateResponse.body.contact.twitter).toBeNull();

      const updateData = {
        displayName: 'changedTestUser',
        contact: { twitter: 2 },
      };

      const response = await request(app)
        .put('/api/users/testuser')
        .send(updateData)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            message:
              'Validation error: Expected string, received number at "contact.twitter"',
          },
        ],
      });
    });
  });
});

describe('disabling user', () => {
  // Delete the changed baseUser and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/users/testuser?force=true');
    // prettier-ignore
    await request(app)
      .post('/api/users')
      .send(baseUser);
  });

  test('succeeds with valid  user', async () => {
    const response = await request(app)
      .put('/api/users/disable/testuser')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: 'Disabled user "testuser"' });
  });

  test('fails with 404 on non-existing user', async () => {
    const response = await request(app)
      .put('/api/users/disable/nonexisting')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'User to disable was not found.' }],
    });
  });
});

describe('deleting user data', () => {
  test('succeeds with existing user', async () => {
    const response = await request(app)
      .delete('/api/users/testuser?force=true')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ message: 'Deleted user "testuser"' });
  });

  test('fails with 404 on non-existing user', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/users/nonexisting')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'User to delete was not found.',
        },
      ],
    });
  });
});
