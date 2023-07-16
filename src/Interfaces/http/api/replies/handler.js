const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentReplyByIdHandler = this.postThreadCommentReplyByIdHandler.bind(this);
    this.deleteThreadCommentReplyByIdHandler = this.deleteThreadCommentReplyByIdHandler.bind(this);
  }

  async postThreadCommentReplyByIdHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await addReplyUseCase.execute({
      ...request.payload, threadId, commentId, ownerId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentReplyByIdHandler(request, h) {
    const ownerId = request.auth.credentials.id;
    const { threadId, commentId, replyId } = request.params;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute({
      ownerId,
      threadId,
      commentId,
      replyId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
