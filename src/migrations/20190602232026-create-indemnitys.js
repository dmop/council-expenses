module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('indemnities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      office_rent: {
        type: DataTypes.FLOAT,
      },
      condominium: {
        type: DataTypes.FLOAT,
      },
      energy: {
        type: DataTypes.FLOAT,
      },
      water: {
        type: DataTypes.FLOAT,
      },
      iptu: {
        type: DataTypes.FLOAT,
      },
      internet_phone: {
        type: DataTypes.FLOAT,
      },
      drives: {
        type: DataTypes.FLOAT,
      },
      car_rent: {
        type: DataTypes.FLOAT,
      },
      car_maintenance: {
        type: DataTypes.FLOAT,
      },
      researchs: {
        type: DataTypes.FLOAT,
      },
      office_materials: {
        type: DataTypes.FLOAT,
      },
      software: {
        type: DataTypes.FLOAT,
      },
      news_subscriptions: {
        type: DataTypes.FLOAT,
      },
      graphics: {
        type: DataTypes.FLOAT,
      },
      total: {
        type: DataTypes.FLOAT,
      },
      glosed: {
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
    return queryInterface.dropTable('indemnities');
  }
};