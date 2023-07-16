const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadDetailUseCase', () => {
  it('should throw error if use case payload not contain thread id', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action & Assert
    await expect(getThreadDetailUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_DETAIL.THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if thread id not string', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action & Assert
    await expect(getThreadDetailUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** dummies */
    const threadPayload = {
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-03-03',
      username: 'dicoding',
    };

    const commentPayload = {
      id: 'comment-123',
      content: 'Comment Content',
      date: '2023-03-03',
      deleted: false,
      username: 'dicoding',
      likecount: 12,
      thread: threadId,
    };

    const commentPayloadDeleted = {
      id: 'comment-234',
      content: 'Comment Content',
      date: '2023-03-03',
      deleted: true,
      username: 'dicoding',
      likecount: 0,
      thread: threadId,
    };

    const replyPayload = {
      id: 'reply-123',
      content: 'Reply Content',
      date: '2023-03-03',
      deleted: false,
      username: 'dicoding',
      comment: commentPayload.id,
    };

    const replyPayloadDeleted = {
      id: 'reply-234',
      content: 'Reply Content',
      date: '2023-03-03',
      deleted: true,
      username: 'dicoding',
      comment: commentPayload.id,
    };

    const expectedThread = new Thread(
      {
        id: threadId,
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-03-03',
        username: 'dicoding',
        comments: [
          new Comment({
            id: 'comment-123',
            username: 'dicoding',
            date: '2023-03-03',
            content: 'Comment Content',
            likeCount: 12,
            replies: [
              new Reply({
                id: 'reply-123',
                content: 'Reply Content',
                date: '2023-03-03',
                username: 'dicoding',
              }),
              new Reply({
                id: 'reply-234',
                content: '**balasan telah dihapus**',
                date: '2023-03-03',
                username: 'dicoding',
              }),
            ],
          }),
          new Comment({
            id: 'comment-234',
            username: 'dicoding',
            date: '2023-03-03',
            content: '**komentar telah dihapus**',
            likeCount: 0,
            replies: [
              new Reply({
                id: 'reply-123',
                content: 'Reply Content',
                date: '2023-03-03',
                username: 'dicoding',
              }),
              new Reply({
                id: 'reply-234',
                content: '**balasan telah dihapus**',
                date: '2023-03-03',
                username: 'dicoding',
              }),
            ],
          }),
        ],
      },
    );

    /** mocking implementation */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(threadPayload));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn(() => Promise.resolve([replyPayload, replyPayloadDeleted]));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn(() => Promise.resolve([commentPayload, commentPayloadDeleted]));

    /** create use case implementation */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const actualThreadDetail = await getThreadDetailUseCase.execute({ threadId });

    // Assert
    expect(actualThreadDetail).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(commentPayload.id);
  });
});
