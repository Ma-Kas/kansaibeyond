import request from 'supertest';
import app from '../app';
import { extractCookieFromResponse } from '../utils/test-utils';

const baseUser = {
  username: 'testuser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'testy@test.com',
  displayName: 'the tester',
  password: 'testPassword',
};

const disabledUser = {
  username: 'disabledtestuser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'disabled@test.com',
  displayName: 'the disabled tester',
  password: 'testPassword',
};

let cookie = '';
// Need to create users
beforeAll(async () => {
  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(baseUser);

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(disabledUser);
});

const promoteBaseUserDisableDisabledUser = async () => {
  await request(app)
    .put(`/api/cms/v1/users/${baseUser.username}`)
    .set('Cookie', cookie)
    .send({ role: 'ADMIN' })
    .expect('Content-Type', /application\/json/);

  // prettier-ignore
  await request(app)
    .delete(`/api/cms/v1/logout`)
    .set('Cookie', cookie);

  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: baseUser.username, password: baseUser.password });
  expect(response.status).toEqual(200);
  expect(extractCookieFromResponse(response)).not.toBeNull();
  cookie = extractCookieFromResponse(response);

  await request(app)
    .put(`/api/cms/v1/users/${disabledUser.username}`)
    .set('Cookie', cookie)
    .send({ disabled: true })
    .expect('Content-Type', /application\/json/);
};

describe('login user', () => {
  test('succeeds with valid user data, sets cookie', async () => {
    const response = await request(app)
      .post('/api/cms/v1/login')
      .send({ username: baseUser.username, password: baseUser.password });
    expect(response.status).toEqual(200);
    expect(extractCookieFromResponse(response)).not.toBeNull();
    cookie = extractCookieFromResponse(response);
  });

  test('fails with 404 on non-existing username', async () => {
    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/login')
      .send({ username: 'non-existing', password: baseUser.password })
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'User not found.',
        },
      ],
    });
  });

  test('fails with 401 on wrong password', async () => {
    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/login')
      .send({ username: baseUser.username, password: 'wrong password' })
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Wrong password.',
        },
      ],
    });
  });

  test('fails with 401 if user account was disabled', async () => {
    await promoteBaseUserDisableDisabledUser();

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/login')
      .send({ username: disabledUser.username, password: disabledUser.password })
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Account disabled.',
        },
      ],
    });
  });
});

describe('logout user', () => {
  test('succeeds with valid session', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/cms/v1/logout')
      .set('Cookie', cookie);
    expect(response.status).toEqual(204);
  });

  test('fails with 401 on invalid session cookie (=session invalidated in db)', async () => {
    const response = await request(app)
      .delete('/api/cms/v1/logout')
      .set('Cookie', 'sessionId=324234234234234232')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Session not found.',
        },
      ],
    });
  });
});
