import request from 'supertest';
import app from '../app';

const baseCategory = {
  categoryName: 'test category',
  categorySlug: 'test-category',
  description: 'test-category',
  coverImage: { urlSlug: '/testimage.jpg', altText: 'alt text' },
};

const categoryTestUser = {
  username: 'testPostUser',
  firstName: 'testy',
  lastName: 'McTester',
  email: 'testy@test.com',
  displayName: 'the tester',
  password: 'testPassword',
};

let token = '';
// Need to create user, and log in
beforeAll(async () => {
  // prettier-ignore
  await request(app)
      .post('/api/cms/v1/users')
      .send(categoryTestUser);

  // prettier-ignore
  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: categoryTestUser.username, password: categoryTestUser.password });
  token = response.body.token as string;
});

describe('creating a new category', () => {
  test('succeeds with valid category data', async () => {
    const response = await request(app)
      .post('/api/cms/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(baseCategory)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.categoryName).toEqual(baseCategory.categoryName);
  });

  test('fails with 400 with missing required categoryName', async () => {
    const newCategory = {
      categorySlug: 'test-category-will-fail',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(newCategory)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'CategoryName is required.',
        },
      ],
    });
  });

  test('fails with 400 with invalid category data format', async () => {
    const newCategory = {
      categoryName: 232,
      categorySlug: 'test-category-will-fail',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(newCategory)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "categoryName"',
        },
      ],
    });
  });

  test('fails with 400 on already existing category', async () => {
    const newCategory = {
      categoryName: 'test category',
      categorySlug: 'test-category-2',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/cms/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(newCategory)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'SequelizeUniqueConstraintError: category_name must be unique',
        },
      ],
    });
  });
});

describe('getting categories', () => {
  test('without params returns all categories as json', async () => {
    const response = await request(app)
      .get('/api/cms/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });

  test('with valid categorySlug as param returns specific category', async () => {
    const response = await request(app)
      .get('/api/cms/v1/categories/test-category')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.categorySlug).toEqual('test-category');
  });

  test('with non-existing categorySlug as param returns 404', async () => {
    const response = await request(app)
      .get('/api/cms/v1/categories/nonexisting')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Category not found.' }],
    });
  });
});

describe('updating category', () => {
  // Delete the changed baseCategory and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/cms/v1/categories/test-category');
    // prettier-ignore
    await request(app)
      .post('/api/cms/v1/categories')
      .send(baseCategory);
  });

  test('succeeds with valid update data on existing category', async () => {
    const updateData = { categoryName: 'changedTestCategory' };

    const response = await request(app)
      .put('/api/cms/v1/categories/test-category')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.categoryName).toEqual(updateData.categoryName);
  });

  test('returns 204 with empty update data on existing category', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/cms/v1/categories/test-category')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing category', async () => {
    const updateData = { categoryName: 400 };

    const response = await request(app)
      .put('/api/cms/v1/categories/test-category')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    // .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "categoryName"',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing category', async () => {
    const updateData = { categoryName: 'changedTestCategory' };

    const response = await request(app)
      .put('/api/cms/v1/categories/nonexisting')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Category to update was not found.' }],
    });
  });
});

describe('deleting category', () => {
  test('succeeds with existing category', async () => {
    const response = await request(app)
      .delete('/api/cms/v1/categories/test-category')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      message: 'Deleted category "changedTestCategory"',
    });
  });

  test('fails with 401 if not logged in', async () => {
    const response = await request(app)
      .delete('/api/cms/v1/categories/test-category-2')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'Invalid authorization header.',
        },
      ],
    });
  });

  test('fails with 404 on non-existing category', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/cms/v1/categories/nonexisting')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Category to delete was not found.',
        },
      ],
    });
  });

  describe('that is associated with a blog post', () => {
    // Create tag, post, user, as well as second category,
    beforeAll(async () => {
      const categoryTestPost = {
        postSlug: 'test-post',
        title: 'test post title',
        content: 'test HTML code',
        coverImage: { urlSlug: 'testImage.png', altText: 'test alt' },
        status: 'trash',
        tags: [1],
        categories: [3, 4],
      };

      const categoryTestCategory = {
        categoryName: 'Category Test Category',
        categorySlug: 'category-test-category',
      };

      const categoryTestCategory2 = {
        categoryName: 'Category Test Category 2',
        categorySlug: 'category-test-category-2',
      };

      const categoryTestTag = {
        tagName: 'Category Test Tag',
        tagSlug: 'category-test-tag',
      };

      // prettier-ignore
      const testCategoryResponse = await request(app)
        .post('/api/cms/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryTestCategory);
      expect(testCategoryResponse.body.id).toEqual(3);

      // prettier-ignore
      const testCategory2Response = await request(app)
        .post('/api/cms/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryTestCategory2);
      expect(testCategory2Response.body.id).toEqual(4);

      // prettier-ignore
      await request(app)
        .post('/api/cms/v1/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryTestTag);

      // prettier-ignore
      await request(app)
        .post('/api/cms/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryTestPost);
    });

    test('succeeds if post has other categories', async () => {
      const response = await request(app)
        .delete('/api/cms/v1/categories/category-test-category')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        message: 'Deleted category "Category Test Category"',
      });
    });

    test('fails with 400 if post has no other categories', async () => {
      const response = await request(app)
        .delete('/api/cms/v1/categories/category-test-category-2')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            context: {},
            message:
              'Cannot delete. Category is only category in 1 posts. Affected posts: test-post',
          },
        ],
      });
    });
  });
});
