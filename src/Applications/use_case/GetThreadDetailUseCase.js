const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/replies/entities/Reply');
const Thread = require('../../Domains/threads/entities/Thread');

class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { threadId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    const threadPayload = await this._threadRepository.getThreadById(threadId);
    const commentsPayload = await this._commentRepository.getCommentsByThreadId(threadId);

    const comments = await Promise.all(commentsPayload.map(async (commentPayload) => {
      const commentContent = commentPayload.deleted ? '**komentar telah dihapus**' : commentPayload.content;
      const likeCount = parseInt(commentPayload.likecount);

      const repliesPayload = await this._replyRepository.getRepliesByCommentId(commentPayload.id);
      const replies = await Promise.all(repliesPayload.map(async (replyPayload) => {
        const replyContent = replyPayload.deleted ? '**balasan telah dihapus**' : replyPayload.content;

        return new Reply({
          id: replyPayload.id,
          content: replyContent,
          date: replyPayload.date,
          username: replyPayload.username,
        });
      }));

      return new Comment({
        id: commentPayload.id,
        username: commentPayload.username,
        date: commentPayload.date,
        content: commentContent,
        likeCount,
        replies,
      });
    }));

    return new Thread({
      id: threadPayload.id,
      title: threadPayload.title,
      body: threadPayload.body,
      date: threadPayload.date,
      username: threadPayload.username,
      comments,
    });
  }

  _verifyPayload({
    threadId,
  }) {
    if (!threadId) {
      throw new Error('GET_DETAIL.THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadDetailUseCase;
