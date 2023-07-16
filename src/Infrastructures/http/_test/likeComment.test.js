const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  let userId;
  let accessToken;
  const threadId = 'thread-test';

  beforeAll(async () => {
    // Register new dummy user
    const server = await createServer(container);
    const registerUserPayload = {
      username: 'percobaan',
      password: 'secret-password',
      fullname: 'Forum percobaan',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: registerUserPayload,
    });

    const responseJson = JSON.parse(response.payload);
    userId = responseJson.data.addedUser.id;

    // Add new dummy thread
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  beforeEach(async () => {
    const server = await createServer(container);
    const credentials = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'percobaan',
        password: 'secret-password',
      },
    });

    const credentialsJson = JSON.parse(credentials.payload);
    accessToken = credentialsJson.data.accessToken;
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /comments', () => {
    it('when PUT /threads/{threadId}/comments/{commentId}/likes', async () => {
      // Arrange
      const commentId = 'comment-test';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread id not exists', async () => {
      // Arrange
      const commentId = 'comment-test';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/xxx/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment id not exists', async () => {
      // Arrange
      const commentId = 'comment-test';
      await CommentsTableTestHelper.addComment({ id: commentId, thread: threadId, owner: userId });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/xxx/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });
});
