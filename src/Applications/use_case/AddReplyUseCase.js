const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(addReply.threadId);
    await this._commentRepository.verifyAvailableComment(addReply.commentId);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
