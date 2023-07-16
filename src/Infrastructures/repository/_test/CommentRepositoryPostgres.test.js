const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'defaultuser 1',
    });
    await UsersTableTestHelper.addUser({
      id: 'user-456',
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
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const payload = { threadId: 'thread-123', content: 'Comment content', owner: 'user-123' };
      const addComment = new AddComment(payload);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const payload = { threadId: 'thread-123', content: 'Comment content', owner: 'user-123' };
      const addComment = new AddComment(payload);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });
  });

  describe('verifyAvailableComment', () => {
    it('should throw NotFoundError when comment not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when comment', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment forbidden', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment not forbidden', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return comments payload correctly', async () => {
      // Arrange
      const firstCommentId = 'comment-1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({
        id: firstCommentId, thread: 'thread-123', owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike('user-123', firstCommentId);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toStrictEqual([{
        id: firstCommentId,
        content: 'Comment content',
        date: '2023-03-03T00:00:00.000Z',
        deleted: false,
        username: 'defaultuser 1',
        likecount: '1',
        thread: 'thread-123',
      }]);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError when comment not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteComment('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should soft delete comment by id from database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const [comment] = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment.is_delete).toEqual(false);
    });
  });
});
