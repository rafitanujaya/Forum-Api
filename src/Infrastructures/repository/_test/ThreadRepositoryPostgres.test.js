const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-Percobaan', username: 'dicoding' });
      const payload = { title: 'Thread Title', body: 'Thread body', owner: 'user-Percobaan' };
      const addThread = new AddThread(payload);
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-Percobaan', username: 'dicoding' });
      const payload = { title: 'Thread Title', body: 'Thread body', owner: 'user-Percobaan' };
      const addThread = new AddThread(payload);
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: addThread.owner,
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not available', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread payload correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-Percobaan', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-Percobaan' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-03-03T00:00:00.000Z',
        username: 'dicoding',
      });
    });
  });

  describe('verifyAvailableThread', () => {
    it('should throw NotFoundError when thread not available', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.verifyAvailableThread('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-Percobaan', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-Percobaan' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
