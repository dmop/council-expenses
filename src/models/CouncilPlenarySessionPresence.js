'use strict';

module.exports = (sequelize, DataTypes) => {
    const CouncilPlenarySessionPresence = sequelize.define('council_plenary_session_presence', {
        present: DataTypes.BOOLEAN
    }, {});
    CouncilPlenarySessionPresence.associate = (models) => {
        CouncilPlenarySessionPresence.belongsTo(models.council, {
            foreignKey: 'council_id',
            onDelete: 'CASCADE',
        });
        CouncilPlenarySessionPresence.belongsTo(models.plenary_session, {
            foreignKey: 'plenary_session_id',
            onDelete: 'CASCADE',
        });
    };

    return CouncilPlenarySessionPresence;
};
