const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when one payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Title',
      owner: true,
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Title',
      body: new Date(),
      owner: true,
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
      body: 'Thread body',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
