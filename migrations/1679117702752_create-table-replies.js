/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
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
    comment: {
      type: 'VARCHAR(32)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('replies', '', {
    foreignKeys: [
      {
        columns: 'owner',
        referencesConstraintName: 'fk_replies.id_users.owner_replies',
        references: 'users(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        columns: 'comment',
        referencesConstraintName: 'fk_replies.id_comments.comment_replies',
        references: 'comments(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
