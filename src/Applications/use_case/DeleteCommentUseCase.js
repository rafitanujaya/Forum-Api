class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, ownerId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, ownerId);
    await this._commentRepository.deleteComment(commentId);
  }

  _validatePayload(payload) {
    const { threadId, commentId, ownerId } = payload;
    if (!threadId || !commentId || !ownerId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
