import request from 'supertest';
import app from '../app';

const baseComment = {
  content: 'test comment',
  name: 'test comment author',
  email: 'testauthor@test.com',
  postId: 1,
};

// Need to create user, category and post first to satisfy foreign key requirements
beforeAll(async () => {
  const commentTestCategory = {
    categoryName: 'commentTestCategory',
  };

  const commentTestUser = {
    username: 'commentTestUser',
    firstName: 'testy',
    lastName: 'McTester',
    email: 'testy@test.com',
    displayName: 'the tester',
    password: 'testPassword',
  };

  const commentTestPost = {
    postSlug: 'test-post',
    title: 'test post title',
    content: 'test HTML code',
    media: { name: 'testImage', url: 'http://testImageUrl' },
    tags: ['test', 'test2'],
    categoryId: 1,
  };

  // prettier-ignore
  await request(app)
    .post('/api/categories')
    .send(commentTestCategory);

  // prettier-ignore
  await request(app)
    .post('/api/users')
    .send(commentTestUser);

  // prettier-ignore
  await request(app)
    .post('/api/posts')
    .send(commentTestPost);
});

describe('creating a new comment', () => {
  describe('if not logged in', () => {
    beforeEach(async () => {
      // Delete user to simulate not logged in
      // prettier-ignore
      await request(app)
        .delete('/api/users/commentTestUser');
    });

    test('succeeds with valid comment data non-registered user', async () => {
      // prettier-ignore
      const response = await request(app).post('/api/comments')
        .send(baseComment)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(201);
      expect(response.body.content).toEqual(baseComment.content);
    });

    afterEach(async () => {
      const commentTestUser = {
        username: 'commentTestUser',
        firstName: 'testy',
        lastName: 'McTester',
        email: 'testy@test.com',
        displayName: 'the tester',
        password: 'testPassword',
      };
      // prettier-ignore
      await request(app)
        .post('/api/users')
        .send(commentTestUser);
    });
  });

  test('succeeds with valid comment data registered user', async () => {
    const registeredComment = {
      content: 'test comment',
      postId: 1,
    };
    // prettier-ignore
    const response = await request(app).post('/api/comments')
      .send(registeredComment)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.content).toEqual(registeredComment.content);
  });

  test('fails with 400 with invalid comment data format', async () => {
    const newComment = {
      content: 404,
      name: 'test comment author',
      email: 'testauthor@test.com',
      postId: 1,
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/comments')
      .send(newComment)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "content"',
        },
      ],
    });
  });
});

describe('getting comment data', () => {
  test('without params returns all comments as json', async () => {
    const response = await request(app)
      .get('/api/comments')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body[0].content).toEqual('test comment');
    expect(response.body[0].post.postSlug).toEqual('test-post');
  });

  test('with valid id as param returns specific comment', async () => {
    const response = await request(app)
      .get('/api/comments/2')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.content).toEqual('test comment');
    expect(response.body.user.username).toEqual('commentTestUser');
    expect(response.body.post.postSlug).toEqual('test-post');
  });

  test('with non-existing id as param returns 404', async () => {
    const response = await request(app)
      .get('/api/comments/3434')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Comment not found.' }],
    });
  });
});

describe('deleting comment', () => {
  test('succeeds on existing comment', async () => {
    const response = await request(app)
      .delete('/api/comments/2')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ message: 'Comment deleted' });
  });

  test('fails with 404 on non-existing comment', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/comments/545454')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Comment to delete was not found.',
        },
      ],
    });
  });
});
