const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('harus mengirimkan username dan password'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('username dan password harus string'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token harus string'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token harus string'));
    expect(DomainErrorTranslator.translate(new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat menambahkan thread karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat menambahkan thread karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_CONTAIN_LOCATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment karena path yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat menambahkan comment karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat menambahkan comment karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat reply karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_CONTAIN_LOCATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat reply karena path yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat reply karena path yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat reply karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat menambahkan reply karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat menambahkan reply karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD')))
      .toStrictEqual(new InvariantError('harus mengirimkan id thread dan id comment'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('thread id dan id comment harus string'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD')))
      .toStrictEqual(new InvariantError('harus mengirimkan id thread, id comment, dan id reply'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('thread id, id comment, dan id reply harus string'));
    expect(DomainErrorTranslator.translate(new Error('GET_DETAIL.THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID')))
      .toStrictEqual(new InvariantError('tidak dapat mengambil detail thread karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('thread id harus string'));
    expect(DomainErrorTranslator.translate(new Error('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD')))
      .toStrictEqual(new InvariantError('harus mengirimkan id thread, id comment, dan id user'));
    expect(DomainErrorTranslator.translate(new Error('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat mengambil menyukai komentar karena properti yang dibutuhkan tidak ada'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
