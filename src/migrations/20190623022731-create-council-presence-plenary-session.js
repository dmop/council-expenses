module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('council_plenary_session_presences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      present: {
        type: DataTypes.BOOLEAN,
      },
      plenary_session_id: {
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
            model: 'plenary_sessions',
            key: 'id',
            as: 'plenary_session_id',
        },
      },
      council_id: {
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
            model: 'councils',
            key: 'id',
            as: 'council_id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('council_plenary_session_presences');
  }
};