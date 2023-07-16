const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentByIdHandler = this.postThreadCommentByIdHandler.bind(this);
    this.deleteThreadCommentByIdHandler = this.deleteThreadCommentByIdHandler.bind(this);
    this.PutThreadCommentLikesHandler = this.PutThreadCommentLikesHandler.bind(this);
  }

  async postThreadCommentByIdHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute({
      ...request.payload, threadId, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentByIdHandler(request, h) {
    const ownerId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute({ threadId, commentId, ownerId });
    return {
      status: 'success',
    };
  }

  async PutThreadCommentLikesHandler(request, h) {
    const ownerId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    await likeCommentUseCase.execute({ threadId, commentId, ownerId });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
