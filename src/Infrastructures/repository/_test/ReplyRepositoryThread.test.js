const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'defaultuser 1',
    });
    await UsersTableTestHelper.addUser({
      id: 'user-321',
      username: 'defaultuser 2',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'comment on this thread! (test)',
      body: 'default thread for comment testing!',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply', () => {
    it('should persist reply and return created reply correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const payload = {
        threadId: 'thread-123', commentId: 'comment-123', content: 'Reply content', ownerId: 'user-123',
      };
      const addReply = new AddReply(payload);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const comment = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const payload = {
        threadId: 'thread-123', commentId: 'comment-123', content: 'Reply content', ownerId: 'user-123',
      };
      const addReply = new AddReply(payload);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Reply content',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableReply', () => {
    it('should throw NotFoundError when comment not available', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyAvailableReply({ replyId: 'reply-123' }))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      // Assert
      return expect(replyRepositoryPostgres.verifyAvailableReply('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw NotFoundError when comment', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyOwner({ replyId: 'reply-123', ownerId: 'user-123' }))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment forbidden', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment not forbidden', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should not throw NotFoundError when get reply with comment id', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toStrictEqual([{
        id: 'reply-123',
        content: 'Reply content',
        date: '2023-03-03T00:00:00.000Z',
        deleted: false,
        username: 'defaultuser 1',
        comment: 'comment-123',
      }]);
    });
  });

  describe('deleteReply', () => {
    it('should throw NotFoundError when comment not available', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.deleteReplyById('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should soft delete comment by id from database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const payload = {
        threadId: 'thread-123', commentId: 'comment-123', content: 'Reply content', ownerId: 'user-123',
      };
      const addReply = new AddReply(payload);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.addReply(addReply);

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const [replies] = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies.is_delete).toEqual(true);
    });
  });
});
