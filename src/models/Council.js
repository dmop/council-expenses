'use strict';
module.exports = (sequelize, DataTypes) => {
    const Council = sequelize.define('council', {
        name: DataTypes.STRING,
        civil_name: DataTypes.STRING,
        finance_name: DataTypes.STRING,
        party: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        code: DataTypes.INTEGER,
        bio: DataTypes.STRING,
        birthday: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING
    }, {});

    return Council;
};
