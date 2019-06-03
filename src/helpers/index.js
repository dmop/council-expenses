'use strict';

const formatMoney = (price) => {
    price = price.replace('.', '');

    return +price.replace(',','.');
};

module.exports = {
    formatMoney
};