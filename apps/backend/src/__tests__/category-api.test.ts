import request from 'supertest';
import app from '../app';

const baseCategory = {
  categoryName: 'testcategory',
};

describe('creating a new category', () => {
  test('succeeds with valid category data', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send(baseCategory)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.categoryName).toEqual(baseCategory.categoryName);
  });

  test('fails with 400 with invalid category data format', async () => {
    const newCategory = {
      categoryName: 232,
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/categories')
      .send(newCategory)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "categoryName";',
        },
      ],
    });
  });

  test('fails with 400 on already existing category', async () => {
    const newCategory = {
      categoryName: 'testcategory',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/categories')
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
      .get('/api/categories')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });

  test('with valid categoryName as param returns specific category', async () => {
    const response = await request(app)
      .get('/api/categories/testcategory')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.categoryName).toEqual('testcategory');
  });

  test('with non-existing categoryName as param returns 404', async () => {
    const response = await request(app)
      .get('/api/categories/nonexisting')
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
      .delete('/api/categories/testcategory')
    // prettier-ignore
    await request(app)
      .post('/api/categories')
      .send(baseCategory)
  });

  test('succeeds with valid update data on existing category', async () => {
    const updateData = { categoryName: 'changedTestCategory' };

    const response = await request(app)
      .put('/api/categories/testcategory')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.categoryName).toEqual(updateData.categoryName);
  });

  test('returns 204 with empty update data on existing category', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/categories/testcategory')
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing category', async () => {
    const updateData = { categoryName: 400 };

    const response = await request(app)
      .put('/api/categories/testcategory')
      .send(updateData);
    // .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "categoryName";',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing category', async () => {
    const updateData = { categoryName: 'changedTestCategory' };

    const response = await request(app)
      .put('/api/categories/nonexisting')
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
      .delete('/api/categories/testcategory')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ message: 'Deleted testcategory' });
  });

  test('fails with 404 on non-existing category', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/categories/nonexisting')
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
});
