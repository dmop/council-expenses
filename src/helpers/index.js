'use strict';

const formatMoney = (price) => {
    if (!price) {
        return 0;
    }
    price = price.replace('.', '');

    return +price.replace(',','.');
};

const timeoutDelay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    formatMoney,
    timeoutDelay
};