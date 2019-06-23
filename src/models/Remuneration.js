'use strict';

module.exports = (sequelize, DataTypes) => {
    const Remuneration = sequelize.define('remuneration', {
        total_advantages: DataTypes.FLOAT,
        total_discounts: DataTypes.FLOAT,
        total_liquid: DataTypes.FLOAT,
        date: DataTypes.STRING
    }, {});
    Remuneration.associate = (models) => {
        Remuneration.belongsTo(models.council, {
            foreignKey: 'council_id',
            onDelete: 'CASCADE',
        });
    };

    return Remuneration;
};
