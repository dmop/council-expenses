'use strict';
module.exports = (sequelize, DataTypes) => {
    const Propose = sequelize.define('propose', {
        type: DataTypes.STRING,
        number: DataTypes.STRING,
        date: DataTypes.STRING,
        number: DataTypes.INTEGER,
        in_process: DataTypes.BOOLEAN,
        is_controversial: DataTypes.BOOLEAN,
        procedure_regime: DataTypes.STRING,
    }, {});
    Propose.associate = (models) => {
        Propose.belongsTo(models.Council, {
            foreignKey: 'council_id',
            onDelete: 'CASCADE',
        });
    };
    return Propose;
};
