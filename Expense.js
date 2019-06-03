// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//     const Expense = sequelize.define('expense', {
//         type: DataTypes.STRING,
//         office_rent: DataTypes.FLOAT,
//         condominium: DataTypes.FLOAT,
//         energy: DataTypes.FLOAT,
//         water: DataTypes.FLOAT,
//         iptu: DataTypes.FLOAT,
//         internet_phone: DataTypes.FLOAT,
//         drives: DataTypes.FLOAT,
//         car_rent: DataTypes.FLOAT,
//         car_maintenance: DataTypes.FLOAT,
//         researchs: DataTypes.FLOAT,
//         office_materials: DataTypes.FLOAT,
//         software: DataTypes.FLOAT,
//         news_subscriptions: DataTypes.FLOAT,
//         graphics: DataTypes.FLOAT,
//         total: DataTypes.FLOAT,
//         glosed: DataTypes.FLOAT,
//     }, {});
//     Expense.associate = (models) => {
//         Expense.belongsTo(models.Council, {
//             foreignKey: 'expenseId',
//             onDelete: 'CASCADE',
//         });
//     };
//     return Expense;
// };
