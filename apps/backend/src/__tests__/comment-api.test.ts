import request from 'supertest';
import app from '../app';
import { extractCookieFromResponse } from '../utils/test-utils';

let cookie = '';
// Need to create user, login, create category, tag and post first to satisfy foreign key requirements
beforeAll(async () => {
  const commentTestCategory = {
    categoryName: 'Comment Test Category',
    categorySlug: 'comment-test-category',
  };

  const commentTestTag = {
    tagName: 'Comment Test Tag',
    tagSlug: 'comment-test-tag',
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
    coverImage: { urlSlug: 'testImage.png', altText: 'test alt' },
    status: 'trash',
    tags: [1],
    categories: [1],
  };

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/users')
    .send(commentTestUser);

  // prettier-ignore
  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: commentTestUser.username, password: commentTestUser.password });
  cookie = extractCookieFromResponse(response);

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/categories')
    .set('Cookie', cookie)
    .send(commentTestCategory);

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/tags')
    .set('Cookie', cookie)
    .send(commentTestTag);

  // prettier-ignore
  await request(app)
    .post('/api/cms/v1/posts')
    .set('Cookie', cookie)
    .send(commentTestPost);
});

describe('creating a new comment', () => {
  test('succeeds with valid comment data registered user', async () => {
    const registeredComment = {
      content: 'test comment',
      postId: 1,
    };
    // prettier-ignore
    const response = await request(app).post('/api/cms/v1/comments')
      .send(registeredComment)
      .set('Cookie', cookie)
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
      .post('/api/cms/v1/comments')
      .set('Cookie', cookie)
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
      .get('/api/cms/v1/comments')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body[0].content).toEqual('test comment');
    expect(response.body[0].post.postSlug).toEqual('test-post');
  });

  test('with valid id as param returns specific comment', async () => {
    const response = await request(app)
      .get('/api/cms/v1/comments/1')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.content).toEqual('test comment');
    expect(response.body.user.username).toEqual('commentTestUser');
    expect(response.body.post.postSlug).toEqual('test-post');
  });

  test('with non-existing id as param returns 404', async () => {
    const response = await request(app)
      .get('/api/cms/v1/comments/3434')
      .set('Cookie', cookie)
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
      .delete('/api/cms/v1/comments/1')
      .set('Cookie', cookie)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ message: 'Comment deleted' });
  });

  test('fails with 404 on non-existing comment', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/cms/v1/comments/545454')
      .set('Cookie', cookie)
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
