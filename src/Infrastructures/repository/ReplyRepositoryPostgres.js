const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, ownerId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, updatedAt, isDelete, ownerId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, ownerId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk menghapus reply');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT
      r.id AS id,
      r.content AS content,
      r.created_at AS date,
      u.username AS username,
      r.is_delete AS deleted,
      r.comment AS comment
      FROM replies r
      JOIN users u ON u.id = r.owner
      WHERE r.comment = $1
      ORDER BY r.created_at ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
