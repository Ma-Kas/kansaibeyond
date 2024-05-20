import request from 'supertest';
import app from '../app';

const baseTag = {
  tagName: 'test tag',
  tagSlug: 'test-tag',
};

const tagTestUser = {
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
      .send(tagTestUser);

  // prettier-ignore
  const response = await request(app)
    .post('/api/cms/v1/login')
    .send({ username: tagTestUser.username, password: tagTestUser.password });
  token = response.body.token as string;
});

describe('creating a new tag', () => {
  test('succeeds with valid tag data', async () => {
    const response = await request(app)
      .post('/api/cms/v1/tags')
      .set('Authorization', `Bearer ${token}`)
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
      .post('/api/cms/v1/tags')
      .set('Authorization', `Bearer ${token}`)
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
      .post('/api/cms/v1/tags')
      .set('Authorization', `Bearer ${token}`)
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
      .post('/api/cms/v1/tags')
      .set('Authorization', `Bearer ${token}`)
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
      .get('/api/cms/v1/tags')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
  });

  test('with valid tagSlug as param returns specific tag', async () => {
    const response = await request(app)
      .get('/api/cms/v1/tags/test-tag')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.tagSlug).toEqual('test-tag');
  });

  test('with non-existing tagSlug as param returns 404', async () => {
    const response = await request(app)
      .get('/api/cms/v1/tags/nonexisting')
      .set('Authorization', `Bearer ${token}`)
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
      .delete('/api/cms/v1/tags/test-tag');
    // prettier-ignore
    await request(app)
      .post('/api/cms/v1/tags')
      .send(baseTag);
  });

  test('succeeds with valid update data on existing tag', async () => {
    const updateData = { tagName: 'changedTestTag' };

    const response = await request(app)
      .put('/api/cms/v1/tags/test-tag')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body.tagName).toEqual(updateData.tagName);
  });

  test('returns 204 with empty update data on existing tag', async () => {
    const updateData = {};

    const response = await request(app)
      .put('/api/cms/v1/tags/test-tag')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.status).toEqual(204);
  });

  test('fails with 400 with invalid update data on existing tag', async () => {
    const updateData = { tagName: 400 };

    const response = await request(app)
      .put('/api/cms/v1/tags/test-tag')
      .set('Authorization', `Bearer ${token}`)
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

  test('fails with 401 if not logged in', async () => {
    const updateData = { tagName: 'a new tag name' };

    const response = await request(app)
      .put('/api/cms/v1/tags/test-tag')
      .send(updateData);
    // .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'Invalid authorization header.',
        },
      ],
    });
  });

  test('fails with 404 with valid update data on non-existing tag', async () => {
    const updateData = { tagName: 'changedTestTag' };

    const response = await request(app)
      .put('/api/cms/v1/tags/nonexisting')
      .set('Authorization', `Bearer ${token}`)
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
      .delete('/api/cms/v1/tags/test-tag')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      message: 'Deleted tag "changedTestTag"',
    });
  });

  test('fails with 404 on non-existing tag', async () => {
    // prettier-ignore
    const response = await request(app)
      .delete('/api/cms/v1/tags/nonexisting')
      .set('Authorization', `Bearer ${token}`)
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
        tags: [3, 4],
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

      // prettier-ignore
      const response2 = await request(app)
        .post('/api/cms/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(tagTestCategory);
      expect(response2.body.id).toEqual(1);

      // prettier-ignore
      const response3 = await request(app)
        .post('/api/cms/v1/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(tagTestTag);
      expect(response3.body.id).toEqual(3);

      // prettier-ignore
      const response4 = await request(app)
        .post('/api/cms/v1/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(tagTestTag2);
      expect(response4.body.id).toEqual(4);

      // prettier-ignore
      await request(app)
        .post('/api/cms/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(tagTestPost);
    });
    test('succeeds if post has other tag', async () => {
      const response = await request(app)
        .delete('/api/cms/v1/tags/tag-test-tag')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        message: 'Deleted tag "Tag Test Tag"',
      });
    });
    test('fails with 400 if post has no other tags', async () => {
      const response = await request(app)
        .delete('/api/cms/v1/tags/tag-test-tag-2')
        .set('Authorization', `Bearer ${token}`)
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
