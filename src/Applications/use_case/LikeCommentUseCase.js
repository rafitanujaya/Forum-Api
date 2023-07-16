class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, ownerId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const likeId = await this._likeRepository.getLikeIdByOwnerAndCommentId(ownerId, commentId);
    if (!likeId) {
      return this._likeRepository.addLike(ownerId, commentId);
    }
    return this._likeRepository.deleteLikeById(likeId);
  }

  _validatePayload(payload) {
    const { threadId, commentId, ownerId } = payload;
    if (!threadId || !commentId || !ownerId) {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
