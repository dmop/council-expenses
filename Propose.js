// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//     const Propose = sequelize.define('propose', {
//         name: DataTypes.STRING,
//         type: DataTypes.STRING,
//         category: DataTypes.STRING,
//         date: DataTypes.STRING,
//         number: DataTypes.INTEGER,
//         in_process: DataTypes.BOOLEAN,
//         is_controversial: DataTypes.BOOLEAN,
//         procedure_regime: DataTypes.STRING,
//     }, {});
//     Propose.associate = (models) => {
//         Propose.belongsTo(models.Council, {
//             foreignKey: 'proposeId',
//             onDelete: 'CASCADE',
//         });
//     };
//     return Propose;
// };
