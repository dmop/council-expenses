'use strict';

module.exports = (sequelize, DataTypes) => {
    const Propose = sequelize.define('propose', {
        year: DataTypes.INTEGER,
        description: DataTypes.STRING,
        url:  DataTypes.STRING,
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        code: DataTypes.INTEGER
    }, {});
    Propose.associate = (models) => {
        Propose.belongsTo(models.council, {
            foreignKey: 'council_id',
            onDelete: 'CASCADE',
        });
    };

    return Propose;
};
