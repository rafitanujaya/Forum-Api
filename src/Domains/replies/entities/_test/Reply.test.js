const Reply = require('../Reply');

describe('A Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply body',
      date: '2023-03-03',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: true,
      date: '2023-03-03',
      username: 'Dicoding',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply body',
      date: '2023-03-03',
      username: 'Dicoding',
    };

    // Action
    const {
      id,
      content,
      date,
      username,
    } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
