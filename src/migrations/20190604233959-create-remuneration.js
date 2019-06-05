module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('remunerations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.STRING,
      },
      office: {
        type: DataTypes.STRING,
      },
      total_advantages: {
        type: DataTypes.FLOAT,
      },
      total_discounts: {
        type: DataTypes.FLOAT,
      },
      total_liquid: {
        type: DataTypes.FLOAT,
      },
      date: {
        type: DataTypes.STRING,
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
    return queryInterface.dropTable('remunerations');
  }
};