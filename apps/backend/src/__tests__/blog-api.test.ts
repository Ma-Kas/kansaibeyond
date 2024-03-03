import request from 'supertest';
import app from '../app';

const baseBlog = {
  routeName: 'test-blog',
  title: 'test blog title',
  content: 'test HTML code',
  media: { name: 'testImage', url: 'testImageUrl' },
  tags: ['test', 'test2'],
  categoryId: 1,
};

// Need to create user and category first to satisfy foreign key requirements
beforeAll(async () => {
  const blogTestCategory = {
    categoryName: 'testBlogCategory',
  };

  const blogTestUser = {
    username: 'testBlogUser',
    firstName: 'testy',
    lastName: 'McTester',
    email: 'testy@test.com',
    displayName: 'the tester',
    password: 'testPassword',
  };

  // prettier-ignore
  await request(app)
      .post('/api/categories')
      .send(blogTestCategory)

  // prettier-ignore
  await request(app)
      .post('/api/users')
      .send(blogTestUser)
});

describe('creating a new blog', () => {
  test('succeeds with valid blog data', async () => {
    // prettier-ignore
    const response = await request(app).post('/api/blogs')
      .send(baseBlog)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual(baseBlog.title);
    expect(response.body.content).toEqual(baseBlog.content);
  });

  test('fails with 400 with invalid blog data format', async () => {
    const newBlog = {
      routeName: 'test-blog',
      title: 400,
      content: 'test HTML code',
      media: { name: 'testImage', url: 'testImageUrl' },
      tags: ['test', 'test2'],
      categoryId: 1,
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/blogs')
      .send(newBlog)
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

  test('fails with 400 on already existing routeName', async () => {
    const newBlog = {
      routeName: 'test-blog',
      title: 'other test blog title',
      content: 'test HTML code',
      media: { name: 'testImage', url: 'testImageUrl' },
      tags: ['test', 'test2'],
      categoryId: 1,
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'SequelizeUniqueConstraintError: route_name must be unique',
        },
      ],
    });
  });
});

describe('getting blog data', () => {
  test('without params returns all blogs as json', async () => {
    const response = await request(app)
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body[0].user.username).toEqual('testBlogUser');
    expect(response.body[0].category.categoryName).toEqual('testBlogCategory');
  });

  test('with valid routeName as param returns specific blog', async () => {
    const response = await request(app)
      .get('/api/blogs/test-blog')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('test blog title');
    expect(response.body.user.username).toEqual('testBlogUser');
    expect(response.body.category.categoryName).toEqual('testBlogCategory');
  });

  test('with non-existing routeName as param returns 404', async () => {
    const response = await request(app)
      .get('/api/blogs/nonexisting')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Blog not found.' }],
    });
  });
});

describe('updating blog', () => {
  // Delete the changed baseBlog and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/blogs/test-blog')
    // prettier-ignore
    await request(app)
      .post('/api/blogs')
      .send(baseBlog)
  });

  test('succeeds with valid update data on existing blog', async () => {
    const updateData = { title: 'changed Test Blog Title' };

    const response = await request(app)
      .put('/api/blogs/test-blog')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual(updateData.title);
  });

  test('returns 204 with empty update data on existing blog', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/blogs/test-blog')
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing blog', async () => {
    const updateData = { title: 400 };

    const response = await request(app)
      .put('/api/blogs/test-blog')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "title";',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing blog', async () => {
    const updateData = { title: 'changed Test Blog Title' };

    const response = await request(app)
      .put('/api/blogs/nonexisting')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Blog to update was not found.' }],
    });
  });
});

describe('deleting blog', () => {
  test('succeeds on existing blog', async () => {
    const response = await request(app)
      .delete('/api/blogs/test-blog')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ message: 'Deleted test-blog' });
  });

  test('fails with 404 on non-existing blog', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/blogs/nonexisting')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Blog to delete was not found.',
        },
      ],
    });
  });
});
