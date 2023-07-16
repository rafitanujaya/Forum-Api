/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(32)',
      onDelete: 'CASCADE',
    },
    thread: {
      type: 'VARCHAR(32)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('comments', '', {
    foreignKeys: [
      {
        columns: 'owner',
        referencesConstraintName: 'fk_comments.id_users.owner_comments',
        references: 'users(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        columns: 'thread',
        referencesConstraintName: 'fk_comments.id_threads.thread_comments',
        references: 'threads(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
