import request from 'supertest';
import { isBefore } from 'date-fns';
import app from '../app';
import {
  extractCookieExpirationFromResponse,
  extractCookieFromResponse,
} from '../utils/test-utils';

const baseUser = {
  username: 'testuser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'testy@test.com',
  displayName: 'the tester',
  password: 'testPassword',
};

const adminUser = {
  username: 'adminUser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'admin@test.com',
  displayName: 'admin',
  password: 'testPassword',
};

let cookie = '';
let cookieExpiration = new Date();
let adminCookie = '';

// Create users, promote adminUser, log in both users to get cookies
beforeAll(async () => {
  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(baseUser);

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(adminUser);

  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: baseUser.username, password: baseUser.password });
  expect(response.status).toEqual(200);
  expect(extractCookieFromResponse(response)).not.toBeNull();
  cookie = extractCookieFromResponse(response);
  cookieExpiration = extractCookieExpirationFromResponse(response);

  const response2 = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: adminUser.username, password: adminUser.password });
  expect(response.status).toEqual(200);
  expect(extractCookieFromResponse(response2)).not.toBeNull();
  adminCookie = extractCookieFromResponse(response2);

  await request(app)
    .put(`/api/cms/v1/users/${adminUser.username}`)
    .set('Cookie', adminCookie)
    .send({ role: 'ADMIN' })
    .expect('Content-Type', /application\/json/);

  // prettier-ignore
  await request(app)
    .delete(`/api/cms/v1/logout`)
    .set('Cookie', adminCookie);

  const adminResponse = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: adminUser.username, password: adminUser.password });
  expect(response.status).toEqual(200);
  expect(extractCookieFromResponse(adminResponse)).not.toBeNull();
  adminCookie = extractCookieFromResponse(adminResponse);
});

describe('trying to authenticate user', () => {
  test('returns false if no session cookie is present', async () => {
    // prettier-ignore
    const response = await request(app)
      .get('/api/cms/v1/auth');
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      auth: false,
    });
  });

  test('returns false if session cookie is invalid', async () => {
    const response = await request(app)
      .get('/api/cms/v1/auth')
      .set('Cookie', 'sessionId=invalid');
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      auth: false,
    });
  });

  test('returns true on valid user credentials and session', async () => {
    // prettier-ignore
    const response = await request(app)
    .get('/api/cms/v1/auth')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      auth: true,
    });
    expect(extractCookieFromResponse(response)).not.toBeNull();
    cookie = extractCookieFromResponse(response);
    cookieExpiration = extractCookieExpirationFromResponse(response);
  });

  test('returns true and isAdmin on valid admin user credentials and session', async () => {
    // prettier-ignore
    const response = await request(app)
    .get('/api/cms/v1/auth')
      .set('Cookie', adminCookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      auth: true,
      isAdmin: true,
    });
  });

  test('returns renewed session cookie on successful authentication', async () => {
    // Timeout to create a difference in expiration times between returned cookie
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // prettier-ignore
    const response = await request(app)
    .get('/api/cms/v1/auth')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      auth: true,
    });
    expect(extractCookieFromResponse(response)).not.toBeNull();

    const renewedCookieExpiration =
      extractCookieExpirationFromResponse(response);

    expect(isBefore(cookieExpiration, renewedCookieExpiration)).toBe(true);
  });
});
