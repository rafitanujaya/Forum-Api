const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getLikeIdByOwnerAndCommentId(ownerId, commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [ownerId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows[0].id;
  }

  async addLike(ownerId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, ownerId],
    };

    await this._pool.query(query);
  }

  async deleteLikeById(likeId) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [likeId],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
