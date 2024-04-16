import request from 'supertest';
import app from '../app';

const baseTag = {
  tagName: 'test tag',
  tagSlug: 'test-tag',
};

describe('creating a new tag', () => {
  test('succeeds with valid tag data', async () => {
    const response = await request(app)
      .post('/api/tags')
      .send(baseTag)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.tagName).toEqual(baseTag.tagName);
  });

  test('fails with 400 with missing required tagName', async () => {
    const newTag = {
      tagSlug: 'test-tag-will-fail',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/tags')
      .send(newTag)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'TagName is required.',
        },
      ],
    });
  });

  test('fails with 400 with invalid tag data format', async () => {
    const newTag = {
      tagName: 232,
      tagSlug: 'test-tag-will-fail',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/tags')
      .send(newTag)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message:
            'Validation error: Expected string, received number at "tagName"',
        },
      ],
    });
  });

  test('fails with 400 on already existing tag', async () => {
    const newTag = {
      tagName: 'test tag',
      tagSlug: 'test-tag-2',
    };

    // prettier-ignore
    const response = await request(app)
      .post('/api/tags')
      .send(newTag)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'SequelizeUniqueConstraintError: tag_name must be unique',
        },
      ],
    });
  });
});

describe('getting tags', () => {
  test('without params returns all tags as json', async () => {
    const response = await request(app)
      .get('/api/tags')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });

  test('with valid tagSlug as param returns specific tag', async () => {
    const response = await request(app)
      .get('/api/tags/test-tag')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.tagSlug).toEqual('test-tag');
  });

  test('with non-existing tagSlug as param returns 404', async () => {
    const response = await request(app)
      .get('/api/tags/nonexisting')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Tag not found.' }],
    });
  });
});

describe('updating tag', () => {
  // Delete the changed baseTag and re-create it
  beforeEach(async () => {
    // prettier-ignore
    await request(app)
      .delete('/api/tags/test-tag');
    // prettier-ignore
    await request(app)
      .post('/api/tags')
      .send(baseTag);
  });

  test('succeeds with valid update data on existing tag', async () => {
    const updateData = { tagName: 'changedTestTag' };

    const response = await request(app)
      .put('/api/tags/test-tag')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.tagName).toEqual(updateData.tagName);
  });

  test('returns 204 with empty update data on existing tag', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/tags/test-tag')
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing tag', async () => {
    const updateData = { tagName: 400 };

    const response = await request(app)
      .put('/api/tags/test-tag')
      .send(updateData);
    // .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Validation error: Expected string, received number at "tagName"',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing tag', async () => {
    const updateData = { tagName: 'changedTestTag' };

    const response = await request(app)
      .put('/api/tags/nonexisting')
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [{ message: 'Tag to update was not found.' }],
    });
  });
});

describe('deleting tag', () => {
  test('succeeds with existing tag', async () => {
    const response = await request(app)
      .delete('/api/tags/test-tag')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      message: 'Deleted tag "test tag"',
    });
  });

  test('fails with 404 on non-existing tag', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/tags/nonexisting')
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      errors: [
        {
          context: {},
          message: 'Tag to delete was not found.',
        },
      ],
    });
  });
  describe('that is associated with a blog post', () => {
    // Create category, post, user, as well as second tag,
    beforeAll(async () => {
      const tagTestPost = {
        postSlug: 'test-post',
        title: 'test post title',
        content: 'test HTML code',
        coverImage: { urlSlug: 'testImage.png', altText: 'test alt' },
        status: 'trash',
        tags: [7, 8],
        categories: [1],
      };

      const tagTestCategory = {
        categoryName: 'Tag Test Category',
        categorySlug: 'tag-test-category',
      };

      const tagTestTag = {
        tagName: 'Tag Test Tag',
        tagSlug: 'tag-test-tag',
      };

      const tagTestTag2 = {
        tagName: 'Tag Test Tag 2',
        tagSlug: 'tag-test-tag-2',
      };

      const tagTestUser = {
        username: 'testUser',
        firstName: 'testy',
        lastName: 'McTester',
        email: 'testy@test.com',
        displayName: 'the tester',
        password: 'testPassword',
      };

      // prettier-ignore
      const response2 = await request(app)
        .post('/api/categories')
        .send(tagTestCategory);
      expect(response2.body.id).toEqual(1);

      // prettier-ignore
      const response3 = await request(app)
        .post('/api/tags')
        .send(tagTestTag);
      expect(response3.body.id).toEqual(7);

      // prettier-ignore
      const response4 = await request(app)
        .post('/api/tags')
        .send(tagTestTag2);
      expect(response4.body.id).toEqual(8);

      // prettier-ignore
      await request(app)
        .post('/api/users')
        .send(tagTestUser);

      // prettier-ignore
      await request(app)
        .post('/api/posts')
        .send(tagTestPost);
    });
    test('succeeds if post has other tag', async () => {
      const response = await request(app)
        .delete('/api/tags/tag-test-tag')
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        message: 'Deleted tag "Tag Test Tag"',
      });
    });
    test('fails with 400 if post has no other tags', async () => {
      const response = await request(app)
        .delete('/api/tags/tag-test-tag-2')
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        errors: [
          {
            context: {},
            message:
              'Cannot delete. Tag is only tag in 1 posts. Affected posts: test-post',
          },
        ],
      });
    });
  });
});
