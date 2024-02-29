import request from 'supertest';
import app from '../app';

describe('creating a new user', () => {
  test('succeeds with valid user data', async () => {
    const newUser = {
      username: 'testuser',
      firstName: 'testy',
      lastName: 'McTester',
      email: 'testy@test.com',
      displayName: 'the tester',
      password: 'testPassword',
    };

    const response = await request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(newUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.username).toEqual(newUser.username);
  });

  test('fails with 400 with invalid user data', async () => {
    const newUser = {
      username: 'testuser2',
      firstName: 2,
      lastName: 'McTester',
      email: 'testy@test.com',
      displayName: 'the tester',
      password: 'testPassword',
    };

    const response = await request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(newUser);
    expect(response.status).toEqual(400);
  });
});

describe('when accessing database at api/users', () => {
  test('returns all users as json', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });
});
