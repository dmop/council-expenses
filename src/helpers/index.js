'use strict';

const formatMoney = (price) => {
    if (!price) {
        return 0;
    }
    price = price.replace('.', '');

    return +price.replace(',','.');
};

module.exports = {
    formatMoney
};