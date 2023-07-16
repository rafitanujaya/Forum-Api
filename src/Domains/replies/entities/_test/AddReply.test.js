const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const replaypayload = {
      ownerId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: undefined,
    };

    // Action & Assert
    expect(() => new AddReply(replaypayload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain and comment id', () => {
    const payload = {
      owner: 'user-123',
      content: 'Content',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_LOCATION');
  });

  it('should throw error when comment id did not meet data type specification', () => {
    const payload = {
      commentId: 12335,
      content: 'ini konten komen',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const replaypayload = {
      ownerId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 123,
    };

    // Action & Assert
    expect(() => new AddReply(replaypayload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const replaypayload = {
      ownerId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'reply body',
    };

    // Action
    const {
      content: content_, ownerId: ownerId_, threadId: threadId_, commentId: commentId_,
    } = new AddReply(replaypayload);

    // Assert
    expect(content_).toEqual(replaypayload.content);
    expect(ownerId_).toEqual(replaypayload.ownerId);
    expect(threadId_).toEqual(replaypayload.threadId);
    expect(commentId_).toEqual(replaypayload.commentId);
  });
});
