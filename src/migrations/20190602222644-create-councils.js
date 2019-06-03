module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('councils', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      civil_name: {
        type: DataTypes.STRING,
      },
      finance_name: {
        type: DataTypes.STRING,
      },
      party: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
      code: {
        type: DataTypes.INTEGER,
      },
      bio: {
        type: DataTypes.STRING,
      },
      birthday: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
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
    return queryInterface.dropTable('councils');
  }
};