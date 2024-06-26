import request from 'supertest';
import app from '../app';
import { extractCookieFromResponse } from '../utils/test-utils';

const baseAffiliate = {
  blogName: 'test affiliate blog',
  blogUrl: 'http://testblog.com',
  blogDescription: 'A test affiliate',
};

const baseAffiliateWithUser = {
  blogName: 'test affiliate blog with user',
  blogUrl: 'http://testblog2.com',
  blogDescription: 'A test affiliate',
  userId: 1,
};

let cookie = '';
// Create user for affiliate tests with associated user, log in, promote to admin
beforeAll(async () => {
  const affiliateTestUser = {
    username: 'affiliateTestUser',
    firstName: 'testy',
    lastName: 'McTester',
    email: 'testy@test.com',
    displayName: 'the tester',
    password: 'testPassword',
  };

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(affiliateTestUser);

  // prettier-ignore
  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: affiliateTestUser.username, password: affiliateTestUser.password });
  cookie = extractCookieFromResponse(response);

  // prettier-ignore
  await request(app)
    .put('/api/cms/v1/users/affiliateTestUser')
    .set('Cookie', cookie)
    .send({ role: 'ADMIN' });

  // prettier-ignore
  await request(app)
    .delete('/api/cms/v1/logout');

  // prettier-ignore
  const adminResponse = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: affiliateTestUser.username, password: affiliateTestUser.password });
  cookie = extractCookieFromResponse(adminResponse);
});

describe('creating a new affiliate', () => {
  test('succeeds with valid affiliate data', async () => {
    const response = await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(baseAffiliate)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.blogName).toEqual(baseAffiliate.blogName);
    expect(response.body.id).toEqual(1);
  });

  test('succeeds with valid affiliate data associated with user', async () => {
    const response = await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(baseAffiliateWithUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.blogName).toEqual(baseAffiliateWithUser.blogName);
    expect(response.body.userId).toEqual(1);
  });

  test('fails with 400 with missing required blogName', async () => {
    const newAffiliate = {
      blogUrl: 'http://testblog.com',
      blogDescription: 'A test affiliate',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(newAffiliate)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'blogName is required.',
        },
      ],
    });
  });

  test('fails with 400 with non-existing associated user', async () => {
    const newAffiliate = {
      blogName: 'test affiliate blog will fail',
      blogUrl: 'http://testblog22.com',
      blogDescription: 'A test affiliate',
      userId: 99,
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(newAffiliate)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
  });

  test('fails with 400 with invalid affiliate data format', async () => {
    const newAffiliate = {
      blogName: 22,
      blogUrl: 'http://testblog.com',
      blogDescription: 'A test affiliate',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(newAffiliate)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "blogName"',
        },
      ],
    });
  });

  test('fails with 400 on already existing affiliate', async () => {
    const newAffiliate = {
      blogName: 'test affiliate blog',
      blogUrl: 'http://testblog2.com',
      blogDescription: 'Another test affiliate',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(newAffiliate)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'SequelizeUniqueConstraintError: blog_name must be unique',
        },
      ],
    });
  });
});

describe('getting affiliates', () => {
  test('without params returns all affiliates as json', async () => {
    const response = await request(app)
      .get('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });

  test('with valid id as param returns specific affiliate', async () => {
    const response = await request(app)
      .get('/api/cms/v1/affiliates/1')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.blogName).toEqual('test affiliate blog');
  });

  test('with non-existing id as param returns 404', async () => {
    const response = await request(app)
      .get('/api/cms/v1/affiliates/99')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Affiliate not found.' }],
    });
  });
});

describe('updating affiliate', () => {
  // Delete the changed baseAffiliate and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/cms/v1/affiliates/test-affiliate')
      .set('Cookie', cookie);
    // prettier-ignore
    await request(app)
      .post('/api/cms/v1/affiliates')
      .set('Cookie', cookie)
      .send(baseAffiliate);
  });

  test('succeeds with valid update data on existing affiliate', async () => {
    const updateData = { blogName: 'changedTestAffiliate' };

    const response = await request(app)
      .put('/api/cms/v1/affiliates/2')
      .set('Cookie', cookie)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.blogName).toEqual(updateData.blogName);
  });

  test('returns 204 with empty update data on existing affiliate', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/cms/v1/affiliates/2')
      .set('Cookie', cookie)
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing affiliate', async () => {
    const updateData = { blogName: 400 };

    const response = await request(app)
      .put('/api/cms/v1/affiliates/2')
      .set('Cookie', cookie)
      .send(updateData);
    // .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "blogName"',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing affiliate', async () => {
    const updateData = { blogName: 'changedTestAffiliate' };

    const response = await request(app)
      .put('/api/cms/v1/affiliates/99')
      .set('Cookie', cookie)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Affiliate to update was not found.' }],
    });
  });
});

describe('deleting affiliate', () => {
  test('succeeds with existing affiliate', async () => {
    const response = await request(app)
      .delete('/api/cms/v1/affiliates/2')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      message: 'Deleted affiliate blog: "changedTestAffiliate"',
    });
  });

  test('fails with 404 on non-existing affiliate', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/cms/v1/affiliates/99')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Affiliate to delete was not found.',
        },
      ],
    });
  });
});
