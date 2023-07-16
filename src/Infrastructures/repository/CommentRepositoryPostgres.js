const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class CommentRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, updatedAt, isDeleted, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: `SELECT 
      c.id AS id, 
      c.content AS content, 
      c.created_at AS date, 
      u.username AS username,
      c.is_delete AS deleted,
      c.thread As thread,
      COUNT(l) as likecount
      FROM comments c
      JOIN users u ON u.id = c.owner
      LEFT JOIN likes l ON l.comment_id = c.id
      WHERE c.thread = $1
      GROUP BY c.id, c.content, c.created_at, u.username, c.is_delete, c.thread
      ORDER BY c.created_at ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan di database');
    }
  }
}

module.exports = CommentRepositoryPostgres;
