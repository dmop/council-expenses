'use strict';

module.exports = (sequelize, DataTypes) => {
    const PlenarySession = sequelize.define('plenary_session', {
        type: DataTypes.STRING,
        code: DataTypes.INTEGER,
        date: DataTypes.STRING,
        name: DataTypes.STRING,
        start_hour: DataTypes.STRING,
        end_hour: DataTypes.BOOLEAN,
        missing: DataTypes.STRING,
        present: DataTypes.STRING
    }, {});

    return PlenarySession;
};
