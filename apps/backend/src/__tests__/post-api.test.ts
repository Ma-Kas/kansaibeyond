import request from 'supertest';
import app from '../app';

const basePost = {
  postSlug: 'test-post',
  title: 'test post title',
  content: 'test HTML code',
  coverImage: { urlSlug: 'testImage.png', altText: 'test alt' },
  status: 'trash',
  tags: [1],
  categories: [1],
};

const postTestUser = {
  username: 'testPostUser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'testy@test.com',
  displayName: 'the tester',
  password: 'testPassword',
};

const postUnauthorizedTestUser = {
  username: 'unauthorizedUser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'testy2@test.com',
  displayName: 'the tester 2',
  password: 'testPassword',
};

let token = '';
// Need to create user, login, create category, tag first to satisfy foreign key requirements
beforeAll(async () => {
  const postTestCategory = {
    categoryName: 'Test Post Category',
    categorySlug: 'test-post-category',
  };

  const postTestTag = {
    tagName: 'Test Post Tag',
    tagSlug: 'test-post-tag',
  };

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(postTestUser);

  // prettier-ignore
  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: postTestUser.username, password: postTestUser.password });
  token = response.body.token as string;

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/categories')
    .set('Authorization', `Bearer ${token}`)
    .send(postTestCategory);

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/tags')
    .set('Authorization', `Bearer ${token}`)
    .send(postTestTag);
});

describe('creating a new post', () => {
  test('succeeds with valid post data', async () => {
    // prettier-ignore
    const response = await request(app).post('/api/cms/v1/posts')
      .send(basePost)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual(basePost.title);
    expect(response.body.content).toEqual(basePost.content);
  });

  test('fails with 400 with invalid post data format', async () => {
    const newPost = {
      postSlug: 'test-post-2',
      title: 400,
      content: 'test HTML code',
      coverImage: { urlSlug: 'testImage.png', altText: 'test alt' },
      tags: [1],
      categories: [1],
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "title"',
        },
      ],
    });
  });

  test('fails with 400 on already existing postSlug', async () => {
    const newPost = {
      postSlug: 'test-post',
      title: 'other test post title',
      content: 'test HTML code',
      coverImage: { urlSlug: 'testImage.png', altText: 'test alt' },
      tags: [1],
      categories: [1],
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'SequelizeUniqueConstraintError: post_slug must be unique',
        },
      ],
    });
  });
});

describe('getting post data', () => {
  test('without params returns all posts as json', async () => {
    const response = await request(app)
      .get('/api/cms/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body[0].user.username).toEqual('testPostUser');
    expect(response.body[0].categories[0].categoryName).toEqual(
      'Test Post Category'
    );
  });

  test('with valid postSlug as param returns specific post', async () => {
    const response = await request(app)
      .get('/api/cms/v1/posts/test-post')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('test post title');
    expect(response.body.user.username).toEqual('testPostUser');
    expect(response.body.categories[0].categoryName).toEqual(
      'Test Post Category'
    );
  });

  describe('that belongs to other user', () => {
    // log out, create other user, login
    beforeAll(async () => {
      // prettier-ignore
      await request(app)
        .delete('/api/cms/v1/logout');
      // prettier-ignore
      await request(app)
        .post('/api/cms/v1/users')
        .send(postUnauthorizedTestUser);

      // prettier-ignore
      const response = await request(app)
        .post('/api/cms/v1/login')
        .send({ username: postUnauthorizedTestUser.username, password: postUnauthorizedTestUser.password });
      token = response.body.token as string;
    });

    test('fails with 401', async () => {
      const response = await request(app)
        .get('/api/cms/v1/posts/test-post')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized to access.',
          },
        ],
      });
    });

    // log out, log original user back in
    afterAll(async () => {
      // prettier-ignore
      await request(app)
        .delete('/api/cms/v1/logout');

      // prettier-ignore
      const response = await request(app)
        .post('/api/cms/v1/login')
        .send({ username: postTestUser.username, password: postTestUser.password });
      token = response.body.token as string;
    });
  });

  test('with non-existing postSlug as param returns 404', async () => {
    const response = await request(app)
      .get('/api/cms/v1/posts/nonexisting')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Post not found.' }],
    });
  });
});

describe('updating post', () => {
  // Delete the changed basePost and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/cms/v1/posts/test-post?force=true')
      .set('Authorization', `Bearer ${token}`);
    // prettier-ignore
    await request(app)
      .post('/api/cms/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(basePost);
  });

  test('succeeds with valid update data on existing post', async () => {
    const updateData = { title: 'changed Test Post Title' };

    const response = await request(app)
      .put('/api/cms/v1/posts/test-post')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual(updateData.title);
  });

  test('returns 204 with empty update data on existing post', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/cms/v1/posts/test-post')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing post', async () => {
    const updateData = { title: 400 };

    const response = await request(app)
      .put('/api/cms/v1/posts/test-post')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "title"',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing post', async () => {
    const updateData = { title: 'changed Test Post Title' };

    const response = await request(app)
      .put('/api/cms/v1/posts/nonexisting')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Post to update was not found.' }],
    });
  });

  describe('that belongs to other user', () => {
    // log out, create other user, login
    beforeAll(async () => {
      // prettier-ignore
      await request(app)
        .delete('/api/cms/v1/logout');
      // prettier-ignore
      await request(app)
        .post('/api/cms/v1/users')
        .send(postUnauthorizedTestUser);

      // prettier-ignore
      const response = await request(app)
        .post('/api/cms/v1/login')
        .send({ username: postUnauthorizedTestUser.username, password: postUnauthorizedTestUser.password });
      token = response.body.token as string;
    });

    test('fails with 401', async () => {
      const updateData = { title: 'changed Test Post Title' };

      const response = await request(app)
        .put('/api/cms/v1/posts/test-post')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized to access.',
          },
        ],
      });
    });

    // log out, log original user back in
    afterAll(async () => {
      // prettier-ignore
      await request(app)
        .delete('/api/cms/v1/logout');

      // prettier-ignore
      const response = await request(app)
        .post('/api/cms/v1/login')
        .send({ username: postTestUser.username, password: postTestUser.password });
      token = response.body.token as string;
    });
  });
});

describe('deleting post', () => {
  describe('that belongs to other user', () => {
    // log out, create other user, login
    beforeAll(async () => {
      // prettier-ignore
      await request(app)
        .delete('/api/cms/v1/logout');
      // prettier-ignore
      await request(app)
        .post('/api/cms/v1/users')
        .send(postUnauthorizedTestUser);

      // prettier-ignore
      const response = await request(app)
        .post('/api/cms/v1/login')
        .send({ username: postUnauthorizedTestUser.username, password: postUnauthorizedTestUser.password });
      token = response.body.token as string;
    });

    test('fails with 401', async () => {
      const response = await request(app)
        .delete('/api/cms/v1/posts/test-post?force=true')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(401);
      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized to access.',
          },
        ],
      });
    });

    // log out, log original user back in
    afterAll(async () => {
      // prettier-ignore
      await request(app)
        .delete('/api/cms/v1/logout');

      // prettier-ignore
      const response = await request(app)
        .post('/api/cms/v1/login')
        .send({ username: postTestUser.username, password: postTestUser.password });
      token = response.body.token as string;
    });
  });

  test('succeeds on existing post', async () => {
    const response = await request(app)
      .delete('/api/cms/v1/posts/test-post?force=true')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      message: 'Deleted post "test post title"',
    });
  });

  test('fails with 404 on non-existing post', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/cms/v1/posts/nonexisting')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Post to delete was not found.',
        },
      ],
    });
  });
});
