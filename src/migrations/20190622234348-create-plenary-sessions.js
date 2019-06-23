module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('plenary_sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.STRING,
      },
      code: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      start_hour: {
        type: DataTypes.STRING,
      },
      end_hour: {
        type: DataTypes.STRING,
      },
      missing: {
        type: DataTypes.STRING,
      },
      present: {
        type: DataTypes.STRING,
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
    return queryInterface.dropTable('plenary_sessions');
  }
};