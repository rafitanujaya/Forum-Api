const AddedComment = require('../AddedComment');

describe('A AddedComment should', () => {
  it('throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throw error when one or two payload did not contain needed property', () => {
    // Arrange
    const payloadone = {
      id: 'comment-123',
      content: 'comment',
    };

    const payloadtwo = {
      id: 'comment-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payloadone)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payloadtwo)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: true,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Comment content',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
