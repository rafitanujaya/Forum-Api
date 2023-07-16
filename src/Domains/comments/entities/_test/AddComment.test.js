const AddComment = require('../AddComment');

describe('A AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange

    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain thread id', () => {
    const payload = {
      owner: 'user-123',
      content: 'Content',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_LOCATION');
  });

  it('should throw error when thread id did not meet data type specification', () => {
    const payload = {
      threadId: true,
      content: 'content',
      owner: 'user-123',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 432,
      threadId: 'thread-123',
      content: true,
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    // Arrange

    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'content',
    };

    // Action
    const {
      threadId: threadId_,
      owner: ownerId_,
      content: content_,
    } = new AddComment(payload);

    // Assert
    expect(content_).toEqual(payload.content);
    expect(threadId_).toEqual(payload.threadId);
    expect(ownerId_).toEqual(payload.owner);
  });
});
