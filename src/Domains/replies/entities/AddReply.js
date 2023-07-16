class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      threadId,
      commentId,
      content,
      ownerId,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.ownerId = ownerId;
  }

  _verifyPayload({
    commentId,
    content,
    ownerId,
  }) {
    if (!commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_LOCATION');
    }

    if (typeof commentId !== 'string') {
      throw new Error('ADD_REPLY.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!content || !ownerId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof ownerId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
