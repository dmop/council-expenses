'use strict';

module.exports = (sequelize, DataTypes) => {
    const Indemnity = sequelize.define('indemnity', {
        office_rent: DataTypes.FLOAT,
        condominium: DataTypes.FLOAT,
        energy: DataTypes.FLOAT,
        water: DataTypes.FLOAT,
        iptu: DataTypes.FLOAT,
        internet_phone: DataTypes.FLOAT,
        drives: DataTypes.FLOAT,
        car_rent: DataTypes.FLOAT,
        car_maintenance: DataTypes.FLOAT,
        researchs: DataTypes.FLOAT,
        office_materials: DataTypes.FLOAT,
        software: DataTypes.FLOAT,
        news_subscriptions: DataTypes.FLOAT,
        graphics: DataTypes.FLOAT,
        total: DataTypes.FLOAT,
        glosed: DataTypes.FLOAT,
        date: DataTypes.STRING
    }, {});
    Indemnity.associate = (models) => {
        Indemnity.belongsTo(models.council, {
            foreignKey: 'council_id',
            onDelete: 'CASCADE'
        });
    };

    return Indemnity;
};
