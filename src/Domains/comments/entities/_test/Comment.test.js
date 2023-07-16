const Comment = require('../Comment');

describe('A Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'Dicoding',
      date: '2023-03-23',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'Dicoding',
      date: '2023-03-23',
      content: true,
      likeCount: '12',
      replies: [],
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'Dicoding',
      date: '2023-03-23',
      content: 'Comment content',
      likeCount: 0,
      replies: [],
    };

    // Action
    const {
      id,
      username,
      date,
      content,
      likeCount,
      replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies).toEqual(payload.replies);
  });
});
