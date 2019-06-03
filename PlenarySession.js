// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//     const PlenarySession = sequelize.define('plenarySession', {
//         date: DataTypes.STRING,
//         name: DataTypes.STRING,
//         party: DataTypes.STRING,
//         active: DataTypes.BOOLEAN,
//         code: DataTypes.INTEGER,
//         bio: DataTypes.STRING
//     }, {});
//     PlenarySession.associate = (models) => {
//         PlenarySession.belongsTo(models.Council, {
//             foreignKey: 'plenarySessionId',
//             onDelete: 'CASCADE',
//         });
//     };

//     return PlenarySession;
// };
