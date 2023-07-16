const Addthread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new Addthread(useCasePayload);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
