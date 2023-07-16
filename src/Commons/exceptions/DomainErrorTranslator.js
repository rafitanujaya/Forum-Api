const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'),
  'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai'),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan thread karena properti yang dibutuhkan tidak ada'),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan thread karena tipe data tidak sesuai'),
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'),
  'ADD_COMMENT.NOT_CONTAIN_LOCATION': new InvariantError('tidak dapat membuat comment karena path yang dibutuhkan tidak ada'),
  'ADD_COMMENT.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena tipe data tidak sesuai'),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan comment karena properti yang dibutuhkan tidak ada'),
  'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan comment karena tipe data tidak sesuai'),
  'REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada'),
  'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat reply karena tipe data tidak sesuai'),
  'ADD_REPLY.NOT_CONTAIN_LOCATION': new InvariantError('tidak dapat membuat reply karena path yang dibutuhkan tidak ada'),
  'ADD_REPLY.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat reply karena path yang dibutuhkan tidak ada'),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada'),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat reply karena tipe data tidak sesuai'),
  'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan reply karena properti yang dibutuhkan tidak ada'),
  'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan reply karena tipe data tidak sesuai'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD': new InvariantError('harus mengirimkan id thread dan id comment'),
  'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('thread id dan id comment harus string'),
  'DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD': new InvariantError('harus mengirimkan id thread, id comment, dan id reply'),
  'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('thread id, id comment, dan id reply harus string'),
  'GET_DETAIL.THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID': new InvariantError('tidak dapat mengambil detail thread karena properti yang dibutuhkan tidak ada'),
  'GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('thread id harus string'),
  'LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD': new InvariantError('harus mengirimkan id thread, id comment, dan id user'),
  'LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mengambil menyukai komentar karena properti yang dibutuhkan tidak ada'),
};

module.exports = DomainErrorTranslator;
