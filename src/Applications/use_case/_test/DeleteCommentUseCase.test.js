const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain payload', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });
  it('should throw error if payload not meet data type', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 432,
      ownerId: 'user-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange

    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      ownerId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(payload.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(payload.commentId, payload.ownerId);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(payload.commentId);
  });
});
