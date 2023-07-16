/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    body: {
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
    owner: {
      type: 'VARCHAR(32)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('threads', 'fk_threads.id_users.owner_threads', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
