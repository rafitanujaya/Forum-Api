const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'Thread-123',
      content: 'comment',
      owner: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'comment',
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: 'comment',
        owner: useCasePayload.owner,
      }),
    ));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualAddedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(actualAddedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new AddComment(useCasePayload));
  });
});
