const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain payload', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-2',
      replyId: 'reply-43',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });

  it('should throw error if payload not meet data type', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 432,
      replyId: 'reply-43',
      ownerId: 'user-123',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      ownerId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(payload.commentId);
    expect(mockReplyRepository.verifyAvailableReply).toHaveBeenCalledWith(payload.replyId);
    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(payload.replyId, payload.ownerId);
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(payload.replyId);
  });
});
